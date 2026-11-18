// @ts-nocheck
import { pgTable, serial, text, timestamp, jsonb, integer, boolean } from 'drizzle-orm/pg-core'
import { conteudosGerados, adaptacoesPlataforma } from './index'

export const revisoesQualidade = pgTable('revisoes_qualidade', {
  id: serial('id').primaryKey(),
  materialId: integer('material_id').references(() => conteudosGerados.id).notNull(),
  adaptacaoId: integer('adaptacao_id').references(() => adaptacoesPlataforma.id),
  plataforma: text('plataforma').notNull(),
  criterio: text('criterio').notNull(), // originalidade, coerencia, clareza, gramatica, etc.
  aprovado: boolean('aprovado').notNull(),
  nota: integer('nota'), // 0-10
  observacoes: text('observacoes'),
  revisadoPor: text('revisado_por').notNull(), // 'quality_reviewer' ou 'humano'
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
})

export const seoMetadados = pgTable('seo_metadados', {
  id: serial('id').primaryKey(),
  materialId: integer('material_id').references(() => conteudosGerados.id).notNull(),
  plataforma: text('plataforma').notNull(),
  titulo: text('titulo').notNull(),
  palavrasChave: jsonb('palavras_chave').$type<string[]>().default([]),
  descricao: text('descricao'),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
})

export const exportacoesPublicacao = pgTable('exportacoes_publicacao', {
  id: serial('id').primaryKey(),
  materialId: integer('material_id').references(() => conteudosGerados.id).notNull(),
  plataforma: text('plataforma').notNull(),
  formato: text('formato').notNull(), // 'json', 'markdown', 'texto'
  caminhoArquivo: text('caminho_arquivo'),
  conteudoExportado: jsonb('conteudo_exportado').$type<Record<string, unknown>>().default({}),
  exportadoEm: timestamp('exportado_em').defaultNow().notNull(),
  exportadoPor: text('exportado_por').notNull(),
})

export const estadosPublicacao = pgTable('estados_publicacao', {
  id: serial('id').primaryKey(),
  materialId: integer('material_id').references(() => conteudosGerados.id).notNull(),
  plataforma: text('plataforma').notNull(),
  estado: text('estado').notNull(), // 'rascunho', 'aprovado', 'publicado'
  aprovadoPor: text('aprovado_por'),
  aprovadoEm: timestamp('aprovado_em'),
  publicadoEm: timestamp('publicado_em'),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
  atualizadoEm: timestamp('atualizado_em').defaultNow().notNull(),
})
