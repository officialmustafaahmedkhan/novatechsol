import { PrismaClient, RoleName } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const roles = await Promise.all(
    Object.values(RoleName).map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: {
          name,
          permissions: name === 'ADMIN'
            ? ['ALL']
            : name === 'EDITOR'
            ? ['products:read', 'products:write', 'news:read', 'news:write', 'faqs:read', 'faqs:write']
            : ['products:read', 'news:read'],
        },
      })
    )
  );

  const adminRole = roles.find((r) => r.name === 'ADMIN')!;

  const hashedPassword = await bcrypt.hash('admin123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@corporate.com' },
    update: {},
    create: {
      email: 'admin@corporate.com',
      password: hashedPassword,
      name: 'Admin User',
      roleId: adminRole.id,
    },
  });

  await prisma.websiteSetting.upsert({
    where: { key: 'company_name' },
    update: {},
    create: { key: 'company_name', value: 'NovaTech Solutions', group: 'general' },
  });

  await prisma.websiteSetting.upsert({
    where: { key: 'company_tagline' },
    update: {},
    create: { key: 'company_tagline', value: 'Empowering Innovation Through AI', group: 'general' },
  });

  await prisma.websiteSetting.upsert({
    where: { key: 'company_email' },
    update: {},
    create: { key: 'company_email', value: 'contact@novatech.com', group: 'contact' },
  });

  await prisma.websiteSetting.upsert({
    where: { key: 'company_phone' },
    update: {},
    create: { key: 'company_phone', value: '+1 (555) 123-4567', group: 'contact' },
  });

  await prisma.websiteSetting.upsert({
    where: { key: 'company_address' },
    update: {},
    create: {
      key: 'company_address',
      value: '123 Innovation Drive, San Francisco, CA 94105',
      group: 'contact',
    },
  });

  await prisma.fAQ.createMany({
    skipDuplicates: true,
    data: [
      {
        question: 'What services does NovaTech Solutions offer?',
        answer: 'NovaTech Solutions provides AI-powered business automation, cloud infrastructure consulting, custom software development, and data analytics solutions tailored to enterprise clients.',
        category: 'general',
        sortOrder: 1,
      },
      {
        question: 'How can I request a quote?',
        answer: 'You can request a quote by visiting our Contact page and filling out the inquiry form. Our sales team will get back to you within 24 business hours.',
        category: 'sales',
        sortOrder: 2,
      },
      {
        question: 'What is your pricing model?',
        answer: 'Our pricing varies by product and service. Please visit the Products page for current pricing information, or contact us for a customized enterprise quote.',
        category: 'sales',
        sortOrder: 3,
      },
      {
        question: 'Do you offer support after purchase?',
        answer: 'Yes, we offer 24/7 technical support for all enterprise clients. Support plans are included with annual licenses and can be added to monthly subscriptions.',
        category: 'support',
        sortOrder: 4,
      },
    ],
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
