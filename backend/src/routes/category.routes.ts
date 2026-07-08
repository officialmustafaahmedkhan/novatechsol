import { Router } from 'express';
import { z } from 'zod';
import { CategoryController } from '../controllers/category.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();
const controller = new CategoryController();

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
});

router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.get('/slug/:slug', controller.getBySlug.bind(controller));

router.post('/', authenticate, authorize('ADMIN', 'EDITOR'), validate(categorySchema), controller.create.bind(controller));
router.put('/:id', authenticate, authorize('ADMIN', 'EDITOR'), validate(categorySchema.partial()), controller.update.bind(controller));
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete.bind(controller));

export default router;
