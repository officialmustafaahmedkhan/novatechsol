import prisma from '../utils/prisma';
import { NotFoundError } from '../utils/errors';

export class NewsService {
  async getAll(params: { page?: number; limit?: number; published?: boolean }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.published !== undefined) where.published = params.published;

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: params.published ? { publishedAt: 'desc' } : { createdAt: 'desc' },
      }),
      prisma.news.count({ where }),
    ]);

    return {
      news,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getBySlug(slug: string) {
    const news = await prisma.news.findUnique({ where: { slug } });
    if (!news || !news.published) throw new NotFoundError('News article');
    return news;
  }

  async getById(id: string) {
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) throw new NotFoundError('News article');
    return news;
  }

  async create(data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    image?: string;
    author: string;
    published?: boolean;
  }) {
    return prisma.news.create({
      data: {
        ...data,
        published: data.published || false,
        publishedAt: data.published ? new Date() : null,
      },
    });
  }

  async update(id: string, data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    image?: string;
    author?: string;
    published?: boolean;
  }) {
    await this.getById(id);
    const updateData: any = { ...data };
    if (data.published === true) {
      updateData.publishedAt = new Date();
    }
    return prisma.news.update({ where: { id }, data: updateData });
  }

  async delete(id: string) {
    await this.getById(id);
    await prisma.news.delete({ where: { id } });
  }
}
