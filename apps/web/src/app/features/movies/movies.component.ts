import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { LabDataService } from '../../core/lab-data.service';
import { Movie } from '../../core/models';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './movies.component.html',
})
export class MoviesComponent {
  readonly canManage = computed(() => this.auth.currentUser()?.role === 'ADMIN');
  readonly search = signal('');
  readonly genre = signal('all');
  readonly modalOpen = signal(false);
  readonly editingId = signal('');
  readonly message = signal('');
  readonly imagePreview = signal('');
  readonly saving = signal(false);
  private selectedImage: File | undefined;
  private modalTrigger: HTMLElement | null = null;
  readonly genres = computed(() =>
    [...new Set(this.data.movies().map((item) => item.genre))].sort(),
  );
  readonly filtered = computed(() => {
    const query = this.search().toLowerCase();
    return this.data
      .movies()
      .filter(
        (item) =>
          (this.genre() === 'all' || item.genre === this.genre()) &&
          `${item.title} ${item.genre}`.toLowerCase().includes(query),
      );
  });
  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    genre: new FormControl('Drama', { nonNullable: true, validators: [Validators.required] }),
    year: new FormControl(new Date().getFullYear(), {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1888), Validators.max(2100)],
    }),
    rating: new FormControl(5, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(10)],
    }),
    favorite: new FormControl(false, { nonNullable: true }),
    synopsis: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    imageUrl: new FormControl('', { nonNullable: true }),
  });
  constructor(
    readonly data: LabDataService,
    private readonly auth: AuthService,
    route: ActivatedRoute,
  ) {
    route.queryParamMap.subscribe((params) => this.search.set(params.get('q') ?? ''));
  }
  open(movie?: Movie): void {
    this.modalTrigger =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.editingId.set(movie?.id ?? '');
    this.message.set('');
    this.imagePreview.set(movie?.imageUrl ?? '');
    this.selectedImage = undefined;
    this.form.reset(
      movie
        ? {
            title: movie.title,
            genre: movie.genre,
            year: movie.year,
            rating: movie.rating,
            favorite: movie.favorite,
            synopsis: movie.synopsis,
            imageUrl: movie.imageUrl ?? '',
          }
        : {
            title: '',
            genre: 'Drama',
            year: new Date().getFullYear(),
            rating: 5,
            favorite: false,
            synopsis: '',
            imageUrl: '',
          },
    );
    this.modalOpen.set(true);
  }
  close(): void {
    this.modalOpen.set(false);
    queueMicrotask(() => this.modalTrigger?.focus());
  }
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.message.set('Selecione um arquivo de imagem válido.');
      input.value = '';
      return;
    }
    if (file.size > 1_500_000) {
      this.message.set('A imagem deve ter no máximo 1,5 MB.');
      input.value = '';
      return;
    }
    this.selectedImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = typeof reader.result === 'string' ? reader.result : '';
      this.imagePreview.set(imageUrl);
      this.message.set('');
    };
    reader.readAsDataURL(file);
  }
  async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.saving.set(true);
    try {
      const { imageUrl: _imageUrl, ...input } = value;
      if (this.editingId())
        await this.data.updateMovie(this.editingId(), input, this.selectedImage);
      else await this.data.createMovie(input, this.selectedImage);
      this.close();
    } catch (error) {
      this.message.set(error instanceof Error ? error.message : 'Não foi possível salvar o filme.');
    } finally {
      this.saving.set(false);
    }
  }
  async remove(movie: Movie): Promise<void> {
    if (!confirm(`Excluir o filme ${movie.title}?`)) return;
    try {
      await this.data.deleteMovie(movie.id);
    } catch {
      // O serviço expõe o erro na própria página para permitir nova tentativa.
    }
  }
  async toggleFavorite(movie: Movie): Promise<void> {
    try {
      await this.data.toggleFavorite(movie.id);
    } catch {
      // O serviço expõe o erro na própria página para permitir nova tentativa.
    }
  }
  initials(title: string): string {
    return (
      title
        .split(' ')
        .filter((word) => word.length > 2)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase() || title.slice(0, 2).toUpperCase()
    );
  }
}
