import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { ZodError } from "zod";

import { AppError } from "./lib/errors";
import { checksRoutes } from "./routes/checks";
import { dealsRoutes } from "./routes/deals";
import { providerRoutes } from "./routes/provider";
import { watchRulesRoutes } from "./routes/watchRules";

const app = Fastify({ logger: true });

app.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    const message = firstIssue?.message ?? "Request validation failed";
    return reply.status(400).send({
      error: {
        code: "VALIDATION_ERROR",
        message,
      },
    });
  }

  const prismaCode = (error as { code?: string }).code;
  if (prismaCode === "P2003") {
    return reply.status(400).send({
      error: {
        code: "INVALID_REFERENCE",
        message: "Referenced record does not exist",
      },
    });
  }

  request.log.error(error);
  return reply.status(500).send({
    error: {
      code: "INTERNAL_ERROR",
      message: "Unexpected server error",
    },
  });
});

await app.register(cors, { origin: true });
await app.register(dealsRoutes);
await app.register(watchRulesRoutes);
await app.register(checksRoutes);
await app.register(providerRoutes);

app.get("/", async () => {
  return { message: "TripWatch Lite API" };
});

app.get("/health", async () => {
  return { status: "ok" };
});

const start = async () => {
  try {
    await app.listen({ port: 3001, host: "0.0.0.0" });
    app.log.info("API listening on http://localhost:3001");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
