import { FastifyInstance} from 'fastify'
import {enqueueDealCheck} from '../lib/sqs'

export async function checksRoutes(app: FastifyInstance) {
    app.post('/checks/run', async (req: any) => {
        const {dealId} = req.body;

        await enqueueDealCheck( {dealId} );

        return {status: 'queued', dealId}
    })}