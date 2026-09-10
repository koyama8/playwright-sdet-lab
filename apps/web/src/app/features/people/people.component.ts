import { DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { LabDataService } from '../../core/lab-data.service';
import { Person, Status } from '../../core/models';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './people.component.html',
})
export class PeopleComponent {
  readonly canManage = computed(() => this.auth.currentUser()?.role === 'ADMIN');
  readonly search = signal('');
  readonly status = signal('all');
  readonly modalOpen = signal(false);
  readonly editingId = signal('');
  readonly message = signal('');
  readonly saving = signal(false);
  readonly filtered = computed(() => {
    const query = this.search().toLowerCase();
    return this.data
      .people()
      .filter(
        (item) =>
          (this.status() === 'all' || item.status === this.status()) &&
          `${item.name} ${item.email} ${item.role}`.toLowerCase().includes(query),
      );
  });
  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    role: new FormControl('QA Engineer', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<Status>('ACTIVE', { nonNullable: true }),
  });
  private modalTrigger: HTMLElement | null = null;
  constructor(
    readonly data: LabDataService,
    private readonly auth: AuthService,
    route: ActivatedRoute,
  ) {
    route.queryParamMap.subscribe((params) => this.search.set(params.get('q') ?? ''));
  }
  initials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((value) => value[0])
      .join('')
      .toUpperCase();
  }
  open(person?: Person): void {
    this.modalTrigger =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.editingId.set(person?.id ?? '');
    this.message.set('');
    this.form.reset(
      person
        ? {
            name: person.name,
            email: person.email,
            phone: person.phone,
            role: person.role,
            status: person.status,
          }
        : { name: '', email: '', phone: '', role: 'QA Engineer', status: 'ACTIVE' },
    );
    this.modalOpen.set(true);
  }
  close(): void {
    this.modalOpen.set(false);
    queueMicrotask(() => this.modalTrigger?.focus());
  }
  async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.saving.set(true);
    try {
      const input = { ...value, email: value.email.toLowerCase() };
      if (this.editingId()) await this.data.updatePerson(this.editingId(), input);
      else await this.data.createPerson(input);
      this.close();
    } catch (error) {
      this.message.set(
        error instanceof Error ? error.message : 'Não foi possível salvar a pessoa.',
      );
    } finally {
      this.saving.set(false);
    }
  }
  async remove(person: Person): Promise<void> {
    if (!confirm(`Excluir ${person.name}?`)) return;
    try {
      await this.data.deletePerson(person.id);
    } catch {
      // O serviço expõe o erro na própria página para permitir nova tentativa.
    }
  }
}
