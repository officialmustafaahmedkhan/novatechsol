import prisma from '../utils/prisma';
import { NotFoundError } from '../utils/errors';
import { InquiryStatus } from '@prisma/client';

export class InquiryService {
  async getAll(params: { page?: number; limit?: number; status?: InquiryStatus }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) where.status = params.status;

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.inquiry.count({ where }),
    ]);

    return {
      inquiries,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id: string) {
    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) throw new NotFoundError('Inquiry');
    return inquiry;
  }

  async create(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
  }) {
    return prisma.inquiry.create({ data });
  }

  async updateStatus(id: string, status: InquiryStatus) {
    await this.getById(id);
    return prisma.inquiry.update({ where: { id }, data: { status } });
  }

  async delete(id: string) {
    await this.getById(id);
    await prisma.inquiry.delete({ where: { id } });
  }
}
