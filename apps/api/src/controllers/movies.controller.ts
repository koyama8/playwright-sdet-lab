import type { Request, Response } from 'express';
import { MoviesService } from '../services/movies.service.js';

export class MoviesController {
  constructor(private readonly service = new MoviesService()) {}
  list = async (req: Request, res: Response): Promise<void> => { res.json({ data: await this.service.list((res.locals.validatedQuery ?? req.query) as never) }); };
  get = async (req: Request, res: Response): Promise<void> => { res.json({ data: await this.service.get(req.params.id as string) }); };
  create = async (req: Request, res: Response): Promise<void> => {
    const imageUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : req.body.imageUrl;
    res.status(201).json({ data: await this.service.create({ ...req.body, imageUrl, year: Number(req.body.year), rating: Number(req.body.rating), favorite: req.body.favorite === true || req.body.favorite === 'true' }, req.auth!.sub) });
  };
  update = async (req: Request, res: Response): Promise<void> => {
    const imageUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : req.body.imageUrl;
    const input = { ...req.body, ...(imageUrl !== undefined ? { imageUrl } : {}), ...(req.body.year !== undefined ? { year: Number(req.body.year) } : {}), ...(req.body.rating !== undefined ? { rating: Number(req.body.rating) } : {}) };
    res.json({ data: await this.service.update(req.params.id as string, input) });
  };
  remove = async (req: Request, res: Response): Promise<void> => { await this.service.remove(req.params.id as string); res.status(204).send(); };
  favorite = async (req: Request, res: Response): Promise<void> => { res.json({ data: await this.service.toggleFavorite(req.params.id as string) }); };
}
