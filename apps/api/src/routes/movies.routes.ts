import { Router } from 'express';
import { MoviesController } from '../controllers/movies.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { imageUpload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { movieCreateSchema, movieIdSchema, movieUpdateSchema, moviesQuerySchema } from '../schemas/movies.js';

const router = Router();
const controller = new MoviesController();
router.use(requireAuth);
router.get('/', validate(moviesQuerySchema, 'query'), asyncHandler(controller.list));
router.get('/:id', validate(movieIdSchema, 'params'), asyncHandler(controller.get));
router.post('/', requireAdmin, imageUpload.single('image'), validate(movieCreateSchema), asyncHandler(controller.create));
router.patch('/:id', requireAdmin, imageUpload.single('image'), validate(movieIdSchema, 'params'), validate(movieUpdateSchema), asyncHandler(controller.update));
router.post('/:id/favorite', validate(movieIdSchema, 'params'), asyncHandler(controller.favorite));
router.delete('/:id', requireAdmin, validate(movieIdSchema, 'params'), asyncHandler(controller.remove));
export default router;
