import { FastifyInstance } from "fastify";
import { z } from "zod";

import { AppError } from "../lib/errors";
import { prisma } from "../lib/prisma";

const ruleSchema = z.object({
  email: z.string().trim().email(),
  thresholdPercent: z.number().int().min(1).max(99),
  dealId: z.string().trim().min(1),
});

export async function watchRulesRoutes(app: FastifyInstance) {
  app.post("/watch-rules", async (req: { body: unknown }) => {
    const parsed = ruleSchema.parse(req.body);
    const deal = await prisma.deal.findUnique({
      where: { id: parsed.dealId },
      select: { id: true },
    });

    if (!deal) {
      throw new AppError("NOT_FOUND", "Deal not found", 404);
    }

    return prisma.watchRule.create({ data: parsed });
  });

  app.get("/watch-rules", async () => {
    return prisma.watchRule.findMany({
      include: { deal: true },
      orderBy: { createdAt: "desc" },
    });
  });
}
