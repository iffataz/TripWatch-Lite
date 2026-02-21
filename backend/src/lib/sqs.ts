import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

import { AppError } from "./errors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, "../../../.env");

dotenv.config({ path: rootEnvPath });

const sqs = new SQSClient({});

export async function enqueueDealCheck(payload: { dealId: string }) {
  const queueUrl = process.env.SQS_QUEUE_URL;

  if (!queueUrl) {
    throw new AppError("SQS_NOT_CONFIGURED", "SQS queue URL is missing", 500);
  }

  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(payload),
  });
  await sqs.send(command);
}
