import { Request, Response, NextFunction } from 'express';
import { NewsService } from '../services/news.service';

const newsService = new NewsService();

export class NewsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, published } = req.query;
      const result = await newsService.getAll({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        published: published !== undefined ? published === 'true' : undefined,
      });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const news = await newsService.getBySlug(req.params.slug);
      res.json({ success: true, data: news });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const news = await newsService.getById(req.params.id);
      res.json({ success: true, data: news });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const news = await newsService.create(req.body);
      res.status(201).json({ success: true, data: news });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const news = await newsService.update(req.params.id, req.body);
      res.json({ success: true, data: news });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await newsService.delete(req.params.id);
      res.json({ success: true, message: 'News article deleted' });
    } catch (error) {
      next(error);
    }
  }
}
