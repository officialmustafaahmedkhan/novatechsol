import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export class DashboardController {
  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const [products, categories, news, faqs, inquiries, users] = await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.news.count(),
        prisma.fAQ.count(),
        prisma.inquiry.count(),
        prisma.user.count(),
      ]);

      const recentInquiries = await prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      const publishedProducts = await prisma.product.count({ where: { published: true } });
      const newInquiries = await prisma.inquiry.count({ where: { status: 'NEW' } });

      res.json({
        success: true,
        data: {
          counts: { products, categories, news, faqs, inquiries, users, publishedProducts, newInquiries },
          recentInquiries,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
