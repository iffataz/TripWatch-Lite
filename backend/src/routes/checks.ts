import { FastifyInstance } from "fastify";
import { z } from "zod";

import { AppError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { enqueueDealCheck } from "../lib/sqs";

const runCheckSchema = z.object({
  dealId: z.string().trim().min(1),
});

export async function checksRoutes(app: FastifyInstance) {
  app.post("/checks/run", async (req: { body: unknown }) => {
    const { dealId } = runCheckSchema.parse(req.body);
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      select: { id: true },
    });

    if (!deal) {
      throw new AppError("NOT_FOUND", "Deal not found", 404);
    }

    await enqueueDealCheck({ dealId });
    return { status: "queued", dealId };
  });
}
