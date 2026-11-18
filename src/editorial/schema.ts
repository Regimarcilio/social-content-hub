import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const estadoPublicacaoEnum = pgEnum('estado_publicacao', [
  'rascunho',
  'aprovado',
  'publicado',
])

export const projetosEditoriais = pgTable('projetos_editoriais', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 200 }).notNull(),
  objetivo: text('objetivo'),
  publicoAlvo: text('publico_alvo'),
  tomVoz: varchar('tom_voz', { length: 100 }),
  paletaCores: jsonb('paleta_cores').$type<string[]>().default([]),
  estiloImagens: varchar('estilo_imagens', { length: 200 }),
  regrasRedacao: jsonb('regras_redacao').$type<string[]>().default([]),
  plataformas: jsonb('plataformas').$type<string[]>().default([]),
  series: jsonb('series').$type<string[]>().default([]),
  referencias: jsonb('referencias').$type<string[]>().default([]),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
  atualizadoEm: timestamp('atualizado_em').defaultNow().notNull(),
})

export const plataformas = pgTable('plataformas', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 50 }).notNull().unique(),
  ativo: boolean('ativo').default(true).notNull(),
  limiteCaracteres: integer('limite_caracteres'),
  hashtags: jsonb('hashtags').$type<string[]>().default([]),
  proporcaoImagem: varchar('proporcao_imagem', { length: 20 }),
  estruturaEditorial: jsonb('estrutura_editorial').$type<Record<string, unknown>>().default({}),
})

export const materiais = pgTable('materiais', {
  id: serial('id').primaryKey(),
  projetoId: integer('projeto_id')
    .references(() => projetosEditoriais.id)
    .notNull(),
  assunto: text('assunto').notNull(),
  estado: estadoPublicacaoEnum('estado').default('rascunho').notNull(),
  conteudoOriginal: text('conteudo_original'),
  conteudoPorPlataforma: jsonb('conteudo_por_plataforma').$type<Record<string, string>>().default({}),
  imagemId: integer('imagem_id'),
  briefingImagem: text('briefing_imagem'),
  palavrasChave: jsonb('palavras_chave').$type<string[]>().default([]),
  titulo: text('titulo'),
  descricao: text('descricao'),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
  aprovadoEm: timestamp('aprovado_em'),
  publicadoEm: timestamp('publicado_em'),
  aprovadoPor: varchar('aprovado_por', { length: 200 }),
})
