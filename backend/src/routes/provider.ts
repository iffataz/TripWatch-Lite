import type { FastifyInstance } from "fastify";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().trim().min(1),
});

const PRICE_PATTERN = [0, -1200, -700, 400, -2500, -900, 600, -1800, -300, 800];

function hashDealId(value: string): number {
  let hash = 0;
  for (const char of value) {
    hash += char.charCodeAt(0);
  }
  return hash;
}

export async function providerRoutes(app: FastifyInstance) {
  app.get("/provider/deals/:id", async (req: { params: unknown }) => {
    const { id: dealId } = paramsSchema.parse(req.params);
    const basePriceCents = 50_000;
    const bucketSizeMs = 60_000;
    const bucket = Math.floor(Date.now() / bucketSizeMs);
    const offset = hashDealId(dealId) % PRICE_PATTERN.length;
    const patternIndex = (bucket + offset) % PRICE_PATTERN.length;
    const priceDelta = PRICE_PATTERN[patternIndex] ?? 0;
    const priceCents = Math.max(10_000, basePriceCents + priceDelta);
    const availability = 4 + ((bucket + offset) % 10);

    return {
      dealId,
      priceCents,
      availability,
      checkedAt: new Date(bucket * bucketSizeMs).toISOString(),
    };
  });
}
