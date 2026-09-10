import { Router } from 'express';
import { PeopleController } from '../controllers/people.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { validate } from '../middleware/validate.js';
import { peopleQuerySchema, personCreateSchema, personIdSchema, personUpdateSchema } from '../schemas/people.js';

const router = Router();
const controller = new PeopleController();
router.use(requireAuth);
router.get('/', validate(peopleQuerySchema, 'query'), asyncHandler(controller.list));
router.get('/:id', validate(personIdSchema, 'params'), asyncHandler(controller.get));
router.post('/', requireAdmin, validate(personCreateSchema), asyncHandler(controller.create));
router.patch('/:id', requireAdmin, validate(personIdSchema, 'params'), validate(personUpdateSchema), asyncHandler(controller.update));
router.delete('/:id', requireAdmin, validate(personIdSchema, 'params'), asyncHandler(controller.remove));
export default router;
