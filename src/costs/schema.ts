import { pgTable, serial, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core'
import { projetosEditoriais } from '../editorial/schema'

export const custosPublicacao = pgTable('custos_publicacao', {
  id: serial('id').primaryKey(),
  projetoId: integer('projeto_id').references(() => projetosEditoriais.id).notNull(),
  materialId: integer('material_id'),
  plataforma: text('plataforma').notNull(),
  modeloUsado: text('modelo_usado').notNull(),
  tokensEntrada: integer('tokens_entrada').default(0).notNull(),
  tokensSaida: integer('tokens_saida').default(0).notNull(),
  custo: text('custo').notNull(), // armazenado como string para precisão decimal
  latenciaMs: integer('latencia_ms').default(0).notNull(),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
})

export const limitesUso = pgTable('limites_uso', {
  id: serial('id').primaryKey(),
  projetoId: integer('projeto_id').references(() => projetosEditoriais.id).notNull(),
  tipo: text('tipo').notNull(), // 'requisicoes_por_minuto', 'requisicoes_por_dia', 'imagens_por_dia'
  limite: integer('limite').notNull(),
  usado: integer('usado').default(0).notNull(),
  resetadoEm: timestamp('resetado_em').defaultNow().notNull(),
})

export const cacheSemantico = pgTable('cache_semantico', {
  id: serial('id').primaryKey(),
  chave: text('chave').notNull().unique(),
  resposta: text('resposta').notNull(),
  modeloUsado: text('modelo_usado').notNull(),
  tokens: integer('tokens').default(0).notNull(),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
  expiraEm: timestamp('expira_em').notNull(),
})
