import { FastifyInstance } from "fastify";
import { z } from "zod";

import { AppError } from "../lib/errors";
import { prisma } from "../lib/prisma";

const dealParamsSchema = z.object({
  id: z.string().trim().min(1),
});

export async function dealsRoutes(app: FastifyInstance) {
  app.get("/deals", async () => {
    return prisma.deal.findMany({
      orderBy: { createdAt: "desc" },
    });
  });

  app.get("/deals/:id", async (req: { params: unknown }) => {
    const { id } = dealParamsSchema.parse(req.params);
    const deal = await prisma.deal.findUnique({ where: { id } });

    if (!deal) {
      throw new AppError("NOT_FOUND", "Deal not found", 404);
    }

    return deal;
  });

  app.get("/deals/:id/history", async (req: { params: unknown }) => {
    const { id } = dealParamsSchema.parse(req.params);

    return prisma.dealSnapshot.findMany({
      where: { dealId: id },
      orderBy: { checkedAt: "desc" },
      take: 50,
    });
  });
}
