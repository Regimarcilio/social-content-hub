import { pgTable, serial, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core'
import { projetosEditoriais } from '../editorial/schema'

export const pesquisas = pgTable('pesquisas', {
  id: serial('id').primaryKey(),
  projetoId: integer('projeto_id')
    .references(() => projetosEditoriais.id)
    .notNull(),
  assunto: text('assunto').notNull(),
  fontes: jsonb('fontes').$type<{ url: string; titulo?: string; resumo?: string }[]>().default([]),
  resumo: text('resumo'),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
})

export const estrategias = pgTable('estrategias', {
  id: serial('id').primaryKey(),
  pesquisaId: integer('pesquisa_id')
    .references(() => pesquisas.id)
    .notNull(),
  publicoAlvo: text('publico_alvo').notNull(),
  objetivo: text('objetivo').notNull(),
  abordagem: text('abordagem').notNull(),
  tomVoz: text('tom_voz'),
  plataformas: jsonb('plataformas').$type<string[]>().default([]),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
})
