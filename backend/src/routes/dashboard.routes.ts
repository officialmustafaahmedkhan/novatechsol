import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const controller = new DashboardController();

router.get('/stats', authenticate, authorize('ADMIN'), controller.getStats.bind(controller));

export default router;
