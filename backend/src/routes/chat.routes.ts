import { Router } from 'express';
import { z } from 'zod';
import { ChatController } from '../controllers/chat.controller';
import { validate } from '../middleware/validate';

const router = Router();
const controller = new ChatController();

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000),
});

router.post('/', validate(chatSchema), controller.sendMessage.bind(controller));

export default router;
