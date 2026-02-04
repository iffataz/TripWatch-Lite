import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function dealsRoutes(app: FastifyInstance) {
  app.get('/deals', async () => {
    return prisma.deal.findMany({
      orderBy: { createdAt: 'desc' },
    });
  });

  app.get('/deals/:id/history', async (req: any) => {
    const { id } = req.params;

    return prisma.dealSnapshot.findMany({
      where: { dealId: id },
      orderBy: { checkedAt: 'desc' },
      take: 50,
    });
  });
}
