import type { Request, Response } from 'express';
import { PeopleService } from '../services/people.service.js';

export class PeopleController {
  constructor(private readonly service = new PeopleService()) {}
  list = async (req: Request, res: Response): Promise<void> => { res.json({ data: await this.service.list((res.locals.validatedQuery ?? req.query) as never) }); };
  get = async (req: Request, res: Response): Promise<void> => { res.json({ data: await this.service.get(req.params.id as string) }); };
  create = async (req: Request, res: Response): Promise<void> => { res.status(201).json({ data: await this.service.create(req.body, req.auth!.sub) }); };
  update = async (req: Request, res: Response): Promise<void> => { res.json({ data: await this.service.update(req.params.id as string, req.body) }); };
  remove = async (req: Request, res: Response): Promise<void> => { await this.service.remove(req.params.id as string); res.status(204).send(); };
}
