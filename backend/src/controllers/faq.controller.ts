import { Request, Response, NextFunction } from 'express';
import { FAQService } from '../services/faq.service';

const faqService = new FAQService();

export class FAQController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { published, category } = req.query;
      const faqs = await faqService.getAll({
        published: published !== undefined ? published === 'true' : undefined,
        category: category as string,
      });
      res.json({ success: true, data: faqs });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const faq = await faqService.getById(req.params.id);
      res.json({ success: true, data: faq });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const faq = await faqService.create(req.body);
      res.status(201).json({ success: true, data: faq });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const faq = await faqService.update(req.params.id, req.body);
      res.json({ success: true, data: faq });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await faqService.delete(req.params.id);
      res.json({ success: true, message: 'FAQ deleted' });
    } catch (error) {
      next(error);
    }
  }
}
