import prisma from '../utils/prisma';

export class ChatService {
  async processMessage(message: string): Promise<{ reply: string; source: 'faq' | 'ai' | 'fallback' }> {
    const normalized = message.toLowerCase();

    const faqs = await prisma.fAQ.findMany({ where: { published: true } });
    const matchedFAQs = faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(normalized) ||
        faq.answer.toLowerCase().includes(normalized) ||
        normalized.split(' ').some((word) => word.length > 3 && faq.question.toLowerCase().includes(word))
    );

    if (matchedFAQs.length > 0) {
      const bestMatch = matchedFAQs[0];
      return {
        reply: bestMatch.answer,
        source: 'faq',
      };
    }

    const products = await prisma.product.findMany({
      where: { published: true },
      include: {
        pricing: { orderBy: { effectiveFrom: 'desc' }, take: 1 },
      },
    });

    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(normalized) ||
        (p.description && p.description.toLowerCase().includes(normalized))
    );

    if (matchedProducts.length > 0) {
      const productInfo = matchedProducts
        .map((p) => {
          const price = p.pricing[0]?.price ?? p.basePrice;
          return `${p.name} - $${Number(price).toLocaleString()} ${p.currency}`;
        })
        .join('\n');

      return {
        reply: `Here is the pricing information I found:\n\n${productInfo}\n\nWould you like more details about any of these products? Visit our Products page or contact us for a custom quote.`,
        source: 'faq',
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey });

        const context = faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
        const productContext = products
          .map((p) => {
            const price = p.pricing[0]?.price ?? p.basePrice;
            return `${p.name}: $${Number(price).toLocaleString()} ${p.currency}`;
          })
          .join('\n');

        const systemPrompt = `You are a helpful customer support assistant for NovaTech Solutions, an AI-powered business solutions company. Answer ONLY company-related questions using the provided context. If the question is not related to the company, its products, or services, politely say you can only answer company-related questions and suggest visiting the Contact page.

Company FAQ Context:
${context || 'No FAQs available.'}

Product Pricing:
${productContext || 'No products available.'}`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          max_tokens: 500,
          temperature: 0.3,
        });

        const reply = completion.choices[0]?.message?.content;
        if (reply) {
          return { reply, source: 'ai' };
        }
      } catch {
        console.warn('AI chat failed, falling back to keyword matching');
      }
    }

    return {
      reply: "I am sorry, I could not find information about that in our knowledge base. Please visit our Contact page and our team will be happy to assist you.",
      source: 'fallback',
    };
  }
}
