import { pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const mcpIntegracao = pgTable('mcp_integracao', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(), // 'filesystem', 'fetch', 'github', 'search'
  tipo: text('tipo').notNull(), // 'referencia', 'proprio', 'fornecedor'
  endpoint: text('endpoint'),
  autenticacao: text('autenticacao'), // 'nenhuma', 'oauth', 'chave_api'
  permissoes: jsonb('permissoes').$type<string[]>().default([]),
  ativo: boolean('ativo').default(true).notNull(),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
  atualizadoEm: timestamp('atualizado_em').defaultNow().notNull(),
})

export const publicacaoPlataforma = pgTable('publicacao_plataforma', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(), // 'linkedin', 'reddit', 'facebook', 'instagram', 'youtube', 'tiktok', 'x'
  ativo: boolean('ativo').default(false).notNull(),
  apiUrl: text('api_url'),
  autenticacao: text('autenticacao'), // 'oauth2', 'chave_api', 'token'
  credenciaisCriptografadas: text('credenciais_criptografadas'),
  limiteCaracteres: integer('limite_caracteres'),
  proporcoesImagem: jsonb('proporcoes_imagem').$type<string[]>().default([]),
  permitePublicacaoAutomatica: boolean('permite_publicacao_automatica').default(false).notNull(),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
  atualizadoEm: timestamp('atualizado_em').defaultNow().notNull(),
})
