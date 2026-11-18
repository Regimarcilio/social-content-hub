import { pgTable, serial, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core'
import { pesquisas, estrategias, projetosEditoriais } from './index'

export const conteudosGerados = pgTable('conteudos_gerados', {
  id: serial('id').primaryKey(),
  projetoId: integer('projeto_id').references(() => projetosEditoriais.id).notNull(),
  pesquisaId: integer('pesquisa_id').references(() => pesquisas.id),
  estrategiaId: integer('estrategia_id').references(() => estrategias.id),
  assunto: text('assunto').notNull(),
  conteudoOriginal: text('conteudo_original').notNull(),
  palavrasChave: jsonb('palavras_chave').$type<string[]>().default([]),
  titulo: text('titulo'),
  descricao: text('descricao'),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
})

export const adaptacoesPlataforma = pgTable('adaptacoes_plataforma', {
  id: serial('id').primaryKey(),
  conteudoId: integer('conteudo_id').references(() => conteudosGerados.id).notNull(),
  plataforma: text('plataforma').notNull(),
  conteudoAdaptado: text('conteudo_adaptado').notNull(),
  limiteCaracteres: integer('limite_caracteres'),
  hashtags: jsonb('hashtags').$type<string[]>().default([]),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
})

export const briefingsImagem = pgTable('briefings_imagem', {
  id: serial('id').primaryKey(),
  conteudoId: integer('conteudo_id').references(() => conteudosGerados.id).notNull(),
  conceitoVisual: text('conceito_visual').notNull(),
  estiloArtistico: text('estilo_artistico').notNull(),
  composicao: text('composicao').notNull(),
  iluminacao: text('iluminacao').notNull(),
  paletaCromatica: text('paleta_cromatica').notNull(),
  elementosVisuais: jsonb('elementos_visuais').$type<string[]>().default([]),
  formato: text('formato').notNull(),
  proporcao: text('proporcao').notNull(),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
})

export const imagensGeradas = pgTable('imagens_geradas', {
  id: serial('id').primaryKey(),
  briefingId: integer('briefing_id').references(() => briefingsImagem.id).notNull(),
  etapa: text('etapa').notNull(), // 'conceito' | 'definitiva'
  promptUsado: text('prompt_usado').notNull(),
  caminhoArquivo: text('caminho_arquivo'),
  resolucaoLargura: integer('resolucao_largura'),
  resolucaoAltura: integer('resolucao_altura'),
  conceitoAvaliado: boolean('conceito_avaliado').default(false).notNull(),
  selecionado: boolean('selecionado').default(false).notNull(),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
})
