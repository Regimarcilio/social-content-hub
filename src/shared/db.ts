import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as editorialSchema from '../editorial/schema'
import * as researchSchema from '../research/schema'
import * as imagesSchema from '../images/schema'
import * as qualitySchema from '../quality/schema'
import * as memorySchema from '../memory/schema'
import * as costsSchema from '../costs/schema'
import * as platformsSchema from '../platforms/schema'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não definida. Copie .env.example para .env e preencha.')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, {
  schema: {
    ...editorialSchema,
    ...researchSchema,
    ...imagesSchema,
    ...qualitySchema,
    ...memorySchema,
    ...costsSchema,
    ...platformsSchema,
  },
})

export type EditorialSchema = typeof editorialSchema
export type ResearchSchema = typeof researchSchema
export type ImagesSchema = typeof imagesSchema
export type QualitySchema = typeof qualitySchema
export type MemorySchema = typeof memorySchema
export type CostsSchema = typeof costsSchema
export type PlatformsSchema = typeof platformsSchema
