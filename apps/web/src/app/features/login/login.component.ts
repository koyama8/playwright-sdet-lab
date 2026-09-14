import { Component, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnDestroy {
  readonly error = signal('');
  readonly notice = signal('');
  readonly submitting = signal(false);
  readonly passwordVisible = signal(false);
  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    remember: new FormControl(false, { nonNullable: true }),
  });
  private noticeTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    route: ActivatedRoute,
  ) {
    const storedReason = auth.consumeLogoutReason();
    const expiredFromUrl = route.snapshot.queryParamMap.get('reason') === 'session-expired';
    this.notice.set(
      storedReason ||
        (expiredFromUrl ? 'Você ficou 10 minutos sem atividade. Entre novamente.' : ''),
    );
    if (this.notice()) {
      this.noticeTimer = setTimeout(() => this.dismissNotice(), 15_000);
    }
    if (auth.authenticated()) void router.navigateByUrl('/dashboard');
  }

  ngOnDestroy(): void {
    if (this.noticeTimer) clearTimeout(this.noticeTimer);
  }

  dismissNotice(): void {
    this.notice.set('');
    if (this.noticeTimer) clearTimeout(this.noticeTimer);
    this.noticeTimer = undefined;
  }

  async submit(): Promise<void> {
    this.error.set('');
    this.dismissNotice();
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const { email, password, remember } = this.form.getRawValue();
    this.submitting.set(true);
    if (!(await this.auth.login(email, password, remember))) {
      this.error.set(
        this.auth.loginError() === 'invalid-credentials'
          ? 'E-mail ou senha inválidos.'
          : 'Serviço indisponível no momento. Tente novamente em instantes.',
      );
      this.submitting.set(false);
      return;
    }
    this.submitting.set(false);
    void this.router.navigateByUrl('/dashboard');
  }
}
