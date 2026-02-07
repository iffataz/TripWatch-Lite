import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';
import {SQSClient, SendMessageCommand} from '@aws-sdk/client-sqs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, '../../../.env');

dotenv.config({ path: rootEnvPath });

console.log("Looking for .env at:", rootEnvPath);
const config = {}
const sqs = new SQSClient(
    config
)

export async function enqueueDealCheck(payload:{
    dealId: string;
}) {
    const command = new SendMessageCommand({
        QueueUrl: process.env.SQS_QUEUE_URL!, 
        MessageBody: JSON.stringify(payload)
    });
    await sqs.send(command);
}