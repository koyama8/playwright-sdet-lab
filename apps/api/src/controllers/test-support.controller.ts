import type { Request, Response } from 'express';
import { TestSupportService } from '../services/test-support.service.js';

export class TestSupportController {
  constructor(private readonly service = new TestSupportService()) {}

  reset = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ data: await this.service.resetDemoData(req.auth!.sub) });
  };
}
