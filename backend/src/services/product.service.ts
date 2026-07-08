import prisma from '../utils/prisma';
import { NotFoundError } from '../utils/errors';

export class ProductService {
  async getAll(params: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    published?: boolean;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.published !== undefined) where.published = params.published;
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          pricing: { orderBy: { effectiveFrom: 'desc' }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        pricing: { orderBy: { effectiveFrom: 'desc' } },
      },
    });
    if (!product || !product.published) throw new NotFoundError('Product');
    return product;
  }

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        pricing: { orderBy: { effectiveFrom: 'desc' } },
      },
    });
    if (!product) throw new NotFoundError('Product');
    return product;
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    categoryId: string;
    basePrice: number;
    currency?: string;
    published?: boolean;
  }) {
    return prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        basePrice: data.basePrice,
        currency: data.currency || 'USD',
        published: data.published || false,
      },
      include: {
        category: true,
        images: true,
        pricing: true,
      },
    });
  }

  async update(id: string, data: {
    name?: string;
    slug?: string;
    description?: string;
    categoryId?: string;
    basePrice?: number;
    currency?: string;
    published?: boolean;
  }) {
    await this.getById(id);
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        pricing: { orderBy: { effectiveFrom: 'desc' } },
      },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    await prisma.product.delete({ where: { id } });
  }

  async addImage(productId: string, url: string, alt?: string) {
    await this.getById(productId);
    const maxOrder = await prisma.productImage.findFirst({
      where: { productId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });
    return prisma.productImage.create({
      data: {
        productId,
        url,
        alt,
        sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
      },
    });
  }

  async deleteImage(imageId: string) {
    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image) throw new NotFoundError('Image');
    await prisma.productImage.delete({ where: { id: imageId } });
  }

  async addPricing(productId: string, price: number, effectiveFrom?: string, effectiveTo?: string) {
    await this.getById(productId);
    return prisma.productPricing.create({
      data: {
        productId,
        price,
        effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : new Date(),
        effectiveTo: effectiveTo ? new Date(effectiveTo) : null,
      },
    });
  }

  async getCurrentPricing(productId: string) {
    const now = new Date();
    return prisma.productPricing.findFirst({
      where: {
        productId,
        effectiveFrom: { lte: now },
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: now } }],
      },
      orderBy: { effectiveFrom: 'desc' },
    });
  }
}
