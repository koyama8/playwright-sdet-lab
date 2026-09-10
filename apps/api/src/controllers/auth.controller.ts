import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { env } from '../config/env.js';

export class AuthController {
  constructor(private readonly service = new AuthService()) {}
  login = async (req: Request, res: Response): Promise<void> => { res.status(200).json({ data: await this.service.login(req.body.email, req.body.password) }); };
  refresh = async (req: Request, res: Response): Promise<void> => { res.status(200).json({ data: await this.service.refresh(req.body.refreshToken) }); };
  logout = async (req: Request, res: Response): Promise<void> => { await this.service.logout(req.body.refreshToken); res.status(204).send(); };
  me = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      data: {
        ...req.auth,
        session: { idleTimeoutSeconds: env.SESSION_IDLE_TIMEOUT_SECONDS },
      },
    });
  };
}
