import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

import { z } from 'zod';

const ruleSchema = z.object({
    email: z.email(),
    thresholdPercent: z.number().int().min(1).max(20),
    dealId: z.string(),
})

export async function watchRulesRoutes(app: FastifyInstance) {
  app.post('/watch-rules', async (req: any) => {

    const parsed = ruleSchema.parse(req.body);
    return prisma.watchRule.create({data: parsed})
    
  });

  app.get('/watch-rules', async () => {
    return prisma.watchRule.findMany({
        include: {deal: true}
    })

  })
}
