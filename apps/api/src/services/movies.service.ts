import type { Prisma } from '@prisma/client';
import { MoviesRepository } from '../repositories/movies.repository.js';
import { HttpError } from '../utils/http-error.js';

export class MoviesService {
  constructor(private readonly repository = new MoviesRepository()) {}
  async list(query: { q?: string; genre?: string; favorite?: boolean; page: number; pageSize: number }) {
    const where: Prisma.MovieWhereInput = {};
    if (query.q) where.OR = [{ title: { contains: query.q, mode: 'insensitive' } }, { synopsis: { contains: query.q, mode: 'insensitive' } }];
    if (query.genre) where.genre = { equals: query.genre, mode: 'insensitive' };
    if (query.favorite !== undefined) where.favorite = query.favorite;
    const [items, total] = await this.repository.findMany(where, (query.page - 1) * query.pageSize, query.pageSize);
    return { items, pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) } };
  }
  async get(id: string) { const item = await this.repository.findById(id); if (!item) throw new HttpError(404, 'Movie not found'); return item; }
  async create(input: { title: string; imageUrl?: string; genre: string; year: number; rating: number; favorite: boolean; synopsis: string }, userId: string) {
    if (await this.repository.findByTitle(input.title)) throw new HttpError(409, 'A movie with this title already exists');
    return this.repository.create({ ...input, createdBy: { connect: { id: userId } } });
  }
  async update(id: string, input: Partial<{ title: string; imageUrl?: string; genre: string; year: number; rating: number; favorite: boolean; synopsis: string }>) {
    await this.get(id);
    if (input.title) { const existing = await this.repository.findByTitle(input.title); if (existing && existing.id !== id) throw new HttpError(409, 'A movie with this title already exists'); }
    return this.repository.update(id, input);
  }
  async remove(id: string) { await this.get(id); await this.repository.delete(id); }
  async toggleFavorite(id: string) { const movie = await this.get(id); return this.repository.update(id, { favorite: !movie.favorite }); }
}
