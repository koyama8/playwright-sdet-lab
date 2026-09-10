import { Router } from 'express';
import { TestSupportController } from '../controllers/test-support.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();
const controller = new TestSupportController();

router.use(requireAuth, requireAdmin);
router.post('/reset', asyncHandler(controller.reset));

export default router;
