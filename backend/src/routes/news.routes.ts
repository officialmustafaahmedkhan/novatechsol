import { Router } from 'express';
import { z } from 'zod';
import { NewsController } from '../controllers/news.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();
const controller = new NewsController();

const newsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  image: z.string().optional(),
  author: z.string().min(1, 'Author is required'),
  published: z.boolean().optional(),
});

router.get('/', controller.getAll.bind(controller));
router.get('/slug/:slug', controller.getBySlug.bind(controller));

router.get('/:id', authenticate, authorize('ADMIN', 'EDITOR'), controller.getById.bind(controller));
router.post('/', authenticate, authorize('ADMIN', 'EDITOR'), validate(newsSchema), controller.create.bind(controller));
router.put('/:id', authenticate, authorize('ADMIN', 'EDITOR'), validate(newsSchema.partial()), controller.update.bind(controller));
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete.bind(controller));

export default router;
