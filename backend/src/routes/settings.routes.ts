import { Router } from 'express';
import { z } from 'zod';
import { SettingsController } from '../controllers/settings.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();
const controller = new SettingsController();

const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  group: z.string().optional(),
});

router.get('/', controller.getAll.bind(controller));
router.get('/group/:group', controller.getByGroup.bind(controller));

router.put('/', authenticate, authorize('ADMIN'), validate(settingSchema), controller.upsert.bind(controller));

export default router;
