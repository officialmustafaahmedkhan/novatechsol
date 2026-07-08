import prisma from '../utils/prisma';
import { NotFoundError } from '../utils/errors';

export class CategoryService {
  async getAll() {
    return prisma.category.findMany({
      include: {
        parent: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        _count: { select: { products: true } },
      },
    });
    if (!category) throw new NotFoundError('Category');
    return category;
  }

  async getBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
        products: {
          where: { published: true },
          include: {
            images: { orderBy: { sortOrder: 'asc' }, take: 1 },
            pricing: { orderBy: { effectiveFrom: 'desc' }, take: 1 },
          },
        },
      },
    });
    if (!category) throw new NotFoundError('Category');
    return category;
  }

  async create(data: { name: string; slug: string; description?: string; image?: string; parentId?: string }) {
    return prisma.category.create({ data });
  }

  async update(id: string, data: { name?: string; slug?: string; description?: string; image?: string; parentId?: string }) {
    await this.getById(id);
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.getById(id);
    await prisma.category.delete({ where: { id } });
  }
}
