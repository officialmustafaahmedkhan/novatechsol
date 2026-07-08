import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/settings.service';

const settingsService = new SettingsService();

export class SettingsController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsService.getAll();
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }

  async getByGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsService.getByGroup(req.params.group);
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }

  async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, value, group } = req.body;
      const setting = await settingsService.upsert(key, value, group);
      res.json({ success: true, data: setting });
    } catch (error) {
      next(error);
    }
  }
}
