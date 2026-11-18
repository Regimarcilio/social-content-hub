import { pgTable, serial, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core'
import { conteudosGerados, projetosEditoriais } from './index'

export const versoesMaterial = pgTable('versoes_material', {
  id: serial('id').primaryKey(),
  materialId: integer('material_id').references(() => conteudosGerados.id).notNull(),
  versao: integer('versao').notNull(),
  conteudo: jsonb('conteudo').$type<Record<string, unknown>>().default({}),
  alteracoes: text('alteracoes'),
  criadoPor: text('criado_por').notNull(),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
})

export const historicoPublicacoes = pgTable('historico_publicacoes', {
  id: serial('id').primaryKey(),
  projetoId: integer('projeto_id').references(() => projetosEditoriais.id).notNull(),
  materialId: integer('material_id').references(() => conteudosGerados.id).notNull(),
  plataforma: text('plataforma').notNull(),
  estado: text('estado').notNull(), // 'rascunho', 'aprovado', 'publicado'
  publicadoEm: timestamp('publicado_em'),
  urlPublicacao: text('url_publicacao'),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
})

export const seriesEditoriais = pgTable('series_editoriais', {
  id: serial('id').primaryKey(),
  projetoId: integer('projeto_id').references(() => projetosEditoriais.id).notNull(),
  nome: text('nome').notNull(),
  descricao: text('descricao'),
  numeroEpisodio: integer('numero_episodio').default(1),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
})
