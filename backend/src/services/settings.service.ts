import prisma from '../utils/prisma';

export class SettingsService {
  async getAll() {
    const settings = await prisma.websiteSetting.findMany();
    const grouped: Record<string, Record<string, string>> = {};
    for (const s of settings) {
      if (!grouped[s.group]) grouped[s.group] = {};
      grouped[s.group][s.key] = s.value;
    }
    return grouped;
  }

  async getByKey(key: string) {
    const setting = await prisma.websiteSetting.findUnique({ where: { key } });
    return setting?.value ?? null;
  }

  async getByGroup(group: string) {
    const settings = await prisma.websiteSetting.findMany({ where: { group } });
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return result;
  }

  async upsert(key: string, value: string, group?: string) {
    return prisma.websiteSetting.upsert({
      where: { key },
      update: { value, ...(group ? { group } : {}) },
      create: { key, value, group: group || 'general' },
    });
  }
}
