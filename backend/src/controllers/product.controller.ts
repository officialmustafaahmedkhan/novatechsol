import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, categoryId, search, published } = req.query;
      const result = await productService.getAll({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        categoryId: categoryId as string,
        search: search as string,
        published: published !== undefined ? published === 'true' : undefined,
      });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getBySlug(req.params.slug);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getById(req.params.id);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.delete(req.params.id);
      res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
      next(error);
    }
  }

  async addImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }
      const image = await productService.addImage(
        req.params.productId,
        `/uploads/${req.file.filename}`,
        req.body.alt
      );
      res.status(201).json({ success: true, data: image });
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.deleteImage(req.params.imageId);
      res.json({ success: true, message: 'Image deleted' });
    } catch (error) {
      next(error);
    }
  }

  async addPricing(req: Request, res: Response, next: NextFunction) {
    try {
      const pricing = await productService.addPricing(
        req.params.productId,
        req.body.price,
        req.body.effectiveFrom,
        req.body.effectiveTo
      );
      res.status(201).json({ success: true, data: pricing });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentPricing(req: Request, res: Response, next: NextFunction) {
    try {
      const pricing = await productService.getCurrentPricing(req.params.productId);
      res.json({ success: true, data: pricing });
    } catch (error) {
      next(error);
    }
  }
}
