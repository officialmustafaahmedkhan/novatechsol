import { Router } from 'express';
import { z } from 'zod';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new ProductController();

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  basePrice: z.number().min(0, 'Price must be non-negative'),
  currency: z.string().optional(),
  published: z.boolean().optional(),
});

const pricingSchema = z.object({
  price: z.number().min(0, 'Price must be non-negative'),
  effectiveFrom: z.string().optional(),
  effectiveTo: z.string().optional(),
});

router.get('/', controller.getAll.bind(controller));
router.get('/slug/:slug', controller.getBySlug.bind(controller));

router.get('/:id', authenticate, authorize('ADMIN', 'EDITOR'), controller.getById.bind(controller));
router.post('/', authenticate, authorize('ADMIN', 'EDITOR'), validate(productSchema), controller.create.bind(controller));
router.put('/:id', authenticate, authorize('ADMIN', 'EDITOR'), validate(productSchema.partial()), controller.update.bind(controller));
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete.bind(controller));

router.post('/:productId/images', authenticate, authorize('ADMIN', 'EDITOR'), upload.single('image'), controller.addImage.bind(controller));
router.delete('/images/:imageId', authenticate, authorize('ADMIN', 'EDITOR'), controller.deleteImage.bind(controller));

router.post('/:productId/pricing', authenticate, authorize('ADMIN', 'EDITOR'), validate(pricingSchema), controller.addPricing.bind(controller));
router.get('/:productId/pricing/current', controller.getCurrentPricing.bind(controller));

export default router;
