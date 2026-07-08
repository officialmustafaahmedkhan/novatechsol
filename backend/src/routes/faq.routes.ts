import { Router } from 'express';
import { z } from 'zod';
import { FAQController } from '../controllers/faq.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();
const controller = new FAQController();

const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().optional(),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
});

router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));

router.post('/', authenticate, authorize('ADMIN', 'EDITOR'), validate(faqSchema), controller.create.bind(controller));
router.put('/:id', authenticate, authorize('ADMIN', 'EDITOR'), validate(faqSchema.partial()), controller.update.bind(controller));
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete.bind(controller));

export default router;
