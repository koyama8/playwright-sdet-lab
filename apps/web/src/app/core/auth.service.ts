import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from './api.config';
import type { ApiDataResponse, AuthTokens, AuthUser, StoredSession } from './auth.models';

const SESSION_KEY = 'playwright_lab_auth_session';
const LOGOUT_REASON_KEY = 'playwright_lab_logout_reason';
const ACTIVITY_PERSIST_INTERVAL_MS = 1_000;

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  readonly authenticated = signal(false);
  readonly currentUser = signal<AuthUser | null>(null);
  readonly loginError = signal<'invalid-credentials' | 'unavailable' | null>(null);

  private readonly activityEvents: ReadonlyArray<keyof WindowEventMap> = [
    'pointerdown',
    'keydown',
    'scroll',
    'touchstart',
  ];
  private readonly activityListener = () => this.registerActivity();
  private inactivityTimer: ReturnType<typeof setTimeout> | undefined;
  private refreshPromise: Promise<string> | undefined;
  private session: StoredSession | null = null;
  private lastPersistedActivityAt = 0;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {
    this.restoreSession();
    this.activityEvents.forEach((event) =>
      window.addEventListener(event, this.activityListener, { passive: true }),
    );
  }

  async login(email: string, password: string, remember: boolean): Promise<boolean> {
    this.loginError.set(null);
    try {
      const response = await firstValueFrom(
        this.http.post<ApiDataResponse<AuthTokens>>(`${API_BASE_URL}/auth/login`, {
          email,
          password,
        }),
      );
      this.session = {
        ...response.data,
        remember,
        lastActivityAt: Date.now(),
      };
      this.persistSession();
      this.currentUser.set(response.data.user);
      this.authenticated.set(true);
      sessionStorage.removeItem(LOGOUT_REASON_KEY);
      this.scheduleInactivityTimeout();
      return true;
    } catch (error) {
      this.loginError.set(
        error instanceof HttpErrorResponse && error.status === 401
          ? 'invalid-credentials'
          : 'unavailable',
      );
      return false;
    }
  }

  logout(reason: 'manual' | 'session-expired' = 'manual'): void {
    const refreshToken = this.session?.refreshToken;
    if (refreshToken) {
      this.http
        .post<void>(`${API_BASE_URL}/auth/logout`, { refreshToken })
        .subscribe({ error: () => undefined });
    }
    this.clearSession(reason);
    void this.router.navigate(['/login'], {
      queryParams: reason === 'session-expired' ? { reason: 'session-expired' } : undefined,
      replaceUrl: true,
    });
  }

  expireSession(): void {
    if (!this.authenticated() && !this.session) return;
    this.logout('session-expired');
  }

  accessToken(): string | null {
    return this.session?.accessToken ?? null;
  }

  async refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) return this.refreshPromise;
    const refreshToken = this.session?.refreshToken;
    if (!refreshToken) throw new Error('Refresh token is not available');

    this.refreshPromise = firstValueFrom(
      this.http.post<ApiDataResponse<AuthTokens>>(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      }),
    )
      .then((response) => {
        if (!this.session) throw new Error('Session is not available');
        this.session = {
          ...response.data,
          remember: this.session.remember,
          lastActivityAt: Date.now(),
        };
        this.persistSession();
        this.currentUser.set(response.data.user);
        this.scheduleInactivityTimeout();
        return response.data.accessToken;
      })
      .catch((error: unknown) => {
        this.expireSession();
        throw error;
      })
      .finally(() => {
        this.refreshPromise = undefined;
      });

    return this.refreshPromise;
  }

  consumeLogoutReason(): string {
    const reason = sessionStorage.getItem(LOGOUT_REASON_KEY);
    sessionStorage.removeItem(LOGOUT_REASON_KEY);
    return reason === 'session-expired'
      ? 'Você ficou 10 minutos sem atividade. Entre novamente.'
      : '';
  }

  ngOnDestroy(): void {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    this.activityEvents.forEach((event) =>
      window.removeEventListener(event, this.activityListener),
    );
  }

  private restoreSession(): void {
    const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as StoredSession;
      const timeoutMs = parsed.session.idleTimeoutSeconds * 1_000;
      if (
        !parsed.accessToken ||
        !parsed.refreshToken ||
        Date.now() - parsed.lastActivityAt >= timeoutMs
      ) {
        this.clearSession('session-expired');
        return;
      }
      this.session = parsed;
      this.currentUser.set(parsed.user);
      this.authenticated.set(true);
      this.scheduleInactivityTimeout();
    } catch {
      this.clearSession('manual');
    }
  }

  private registerActivity(): void {
    if (!this.session || !this.authenticated()) return;
    const now = Date.now();
    this.session.lastActivityAt = now;
    this.scheduleInactivityTimeout();
    if (now - this.lastPersistedActivityAt >= ACTIVITY_PERSIST_INTERVAL_MS) {
      this.lastPersistedActivityAt = now;
      this.persistSession();
    }
  }

  private scheduleInactivityTimeout(): void {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    if (!this.session || !this.authenticated()) return;
    const timeoutMs = this.session.session.idleTimeoutSeconds * 1_000;
    const remainingMs = Math.max(0, timeoutMs - (Date.now() - this.session.lastActivityAt));
    this.inactivityTimer = setTimeout(() => this.expireSession(), remainingMs);
  }

  private persistSession(): void {
    if (!this.session) return;
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    const storage = this.session.remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(this.session));
  }

  private clearSession(reason: 'manual' | 'session-expired'): void {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    this.inactivityTimer = undefined;
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    if (reason === 'session-expired') sessionStorage.setItem(LOGOUT_REASON_KEY, reason);
    else sessionStorage.removeItem(LOGOUT_REASON_KEY);
    this.session = null;
    this.currentUser.set(null);
    this.authenticated.set(false);
  }
}
