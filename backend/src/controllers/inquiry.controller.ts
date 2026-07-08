import { Request, Response, NextFunction } from 'express';
import { InquiryService } from '../services/inquiry.service';

const inquiryService = new InquiryService();

export class InquiryController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, status } = req.query;
      const result = await inquiryService.getAll({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        status: status as any,
      });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const inquiry = await inquiryService.getById(req.params.id);
      res.json({ success: true, data: inquiry });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const inquiry = await inquiryService.create(req.body);
      res.status(201).json({ success: true, data: inquiry });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const inquiry = await inquiryService.updateStatus(req.params.id, req.body.status);
      res.json({ success: true, data: inquiry });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await inquiryService.delete(req.params.id);
      res.json({ success: true, message: 'Inquiry deleted' });
    } catch (error) {
      next(error);
    }
  }
}
