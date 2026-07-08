import prisma from '../utils/prisma';
import { NotFoundError } from '../utils/errors';

export class FAQService {
  async getAll(params: { published?: boolean; category?: string }) {
    const where: any = {};
    if (params.published !== undefined) where.published = params.published;
    if (params.category) where.category = params.category;

    return prisma.fAQ.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async getById(id: string) {
    const faq = await prisma.fAQ.findUnique({ where: { id } });
    if (!faq) throw new NotFoundError('FAQ');
    return faq;
  }

  async create(data: {
    question: string;
    answer: string;
    category?: string;
    sortOrder?: number;
    published?: boolean;
  }) {
    return prisma.fAQ.create({ data });
  }

  async update(id: string, data: {
    question?: string;
    answer?: string;
    category?: string;
    sortOrder?: number;
    published?: boolean;
  }) {
    await this.getById(id);
    return prisma.fAQ.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.getById(id);
    await prisma.fAQ.delete({ where: { id } });
  }
}
