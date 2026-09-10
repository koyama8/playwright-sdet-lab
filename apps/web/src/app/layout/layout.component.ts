import { Component, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { LabDataService } from '../core/lab-data.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnDestroy {
  readonly profileOpen = signal(false);
  readonly toast = signal('');
  private toastTimer: ReturnType<typeof setTimeout> | undefined;
  constructor(
    readonly auth: AuthService,
    private readonly data: LabDataService,
    private readonly router: Router,
  ) {
    // Recarrega ao entrar novamente após logout ou expiração da sessão.
    void this.data.refresh();
  }
  userName(): string {
    return this.auth.currentUser()?.name ?? 'QA Admin';
  }
  userRole(): string {
    return this.auth.currentUser()?.role === 'ADMIN' ? 'Administrador' : 'Usuário';
  }
  logout(): void {
    this.auth.logout();
  }
  ngOnDestroy(): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }
  async reset(): Promise<void> {
    if (!confirm('Restaurar todos os dados de demonstração?')) return;
    try {
      await this.data.reset();
      this.showToast('Dados restaurados com sucesso.');
    } catch {
      this.showToast(this.data.error() || 'Não foi possível restaurar os dados.');
    }
  }
  search(value: string): void {
    const text = value.toLowerCase().trim();
    if (!text) return;
    if (
      this.data.people().some((item) => `${item.name} ${item.email}`.toLowerCase().includes(text))
    )
      void this.router.navigate(['/pessoas'], { queryParams: { q: value.trim() } });
    else if (
      this.data.movies().some((item) => `${item.title} ${item.genre}`.toLowerCase().includes(text))
    )
      void this.router.navigate(['/filmes'], { queryParams: { q: value.trim() } });
    else this.showToast('Nenhum resultado encontrado.');
  }
  private showToast(message: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast.set(message);
    this.toastTimer = setTimeout(() => {
      this.toast.set('');
      this.toastTimer = undefined;
    }, 3000);
  }
}
