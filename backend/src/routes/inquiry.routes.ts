import { Router } from 'express';
import { z } from 'zod';
import { InquiryController } from '../controllers/inquiry.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();
const controller = new InquiryController();

const createInquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const updateStatusSchema = z.object({
  status: z.enum(['NEW', 'READ', 'REPLIED', 'CLOSED']),
});

router.post('/', validate(createInquirySchema), controller.create.bind(controller));

router.get('/', authenticate, authorize('ADMIN'), controller.getAll.bind(controller));
router.get('/:id', authenticate, authorize('ADMIN'), controller.getById.bind(controller));
router.put('/:id/status', authenticate, authorize('ADMIN'), validate(updateStatusSchema), controller.updateStatus.bind(controller));
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete.bind(controller));

export default router;
