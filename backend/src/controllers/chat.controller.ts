import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chat.service';

const chatService = new ChatService();

export class ChatController {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = req.body;
      const result = await chatService.processMessage(message);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
