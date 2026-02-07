import type { FastifyInstance } from 'fastify';

/**
 * Provider Simulator (fake third-party API)

 */
export async function providerRoutes(app: FastifyInstance) {
  app.get('/provider/deals/:id', async (req: any) => {
    const dealId: string = req.params.id;

    // Base price in cents (e.g., $500.00 AUD)
    const basePriceCents = 500_00;

   
    const bucket = Math.floor(Date.now() / 30_000); // changes every 30s
    const dealFactor = dealId.length * 37;

    // A pseudo-random-ish fluctuation between -$40 and +$40
    const fluctuationCents = ((bucket + dealFactor) % 8000) - 4000;

    const priceCents = Math.max(50_00, basePriceCents + fluctuationCents); // never below $50
    const availability = 1 + ((bucket + dealFactor) % 20); // 1..20 rooms

    return {
      provider: 'provider-sim',
      dealId,
      currency: 'AUD',
      priceCents,
      availability,
      checkedAt: new Date().toISOString(),
    };
  });
}
