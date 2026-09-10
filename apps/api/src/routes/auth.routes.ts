import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, logoutSchema, refreshSchema } from '../schemas/auth.js';

const router = Router();
const controller = new AuthController();
router.post('/login', validate(loginSchema), asyncHandler(controller.login));
router.post('/refresh', validate(refreshSchema), asyncHandler(controller.refresh));
router.post('/logout', validate(logoutSchema), asyncHandler(controller.logout));
router.get('/me', requireAuth, asyncHandler(controller.me));
export default router;
