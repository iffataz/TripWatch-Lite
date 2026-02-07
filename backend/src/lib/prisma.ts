import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';

import {PrismaClient} from '../../prisma/generated/prisma'
import {PrismaPg} from '@prisma/adapter-pg'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, '../../../.env');

dotenv.config({ path: rootEnvPath });

console.log("Looking for .env at:", rootEnvPath);

const adapter = new PrismaPg(
    {connectionString: process.env.DATABASE_URL}
)

export const prisma = new PrismaClient( {adapter} );