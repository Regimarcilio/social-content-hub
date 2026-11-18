// @ts-nocheck
import { z } from 'zod'

export const gerarConteudoSchema = z.object({
  estrategiaId: z.coerce.number().int().positive(),
  assunto: z.string().min(1, 'Assunto é obrigatório').max(500),
  profundidade: z.enum(['basica', 'intermediaria', 'avancada']).default('intermediaria'),
})

export const adaptarConteudoSchema = z.object({
  conteudoId: z.coerce.number().int().positive(),
  plataformas: z.array(z.string()).min(1, 'Selecione ao menos uma plataforma'),
})

export const criarBriefingImagemSchema = z.object({
  conteudoId: z.coerce.number().int().positive(),
  conceitoVisual: z.string().min(1, 'Conceito visual é obrigatório'),
  estiloArtistico: z.string().min(1, 'Estilo artístico é obrigatório'),
  composicao: z.string().min(1, 'Composição é obrigatória'),
  iluminacao: z.string().min(1, 'Iluminação é obrigatória'),
  paletaCromatica: z.string().min(1, 'Paleta cromática é obrigatória'),
  elementosVisuais: z.array(z.string()).default([]),
  formato: z.string().default('digital'),
  proporcao: z.string().default('1:1'),
})

export const gerarImagemSchema = z.object({
  briefingId: z.coerce.number().int().positive(),
  etapa: z.enum(['conceito', 'definitiva']),
  selecionarConceito: z.boolean().default(false),
})

export type GerarConteudoInput = z.infer<typeof gerarConteudoSchema>
export type AdaptarConteudoInput = z.infer<typeof adaptarConteudoSchema>
export type CriarBriefingImagemInput = z.infer<typeof criarBriefingImagemSchema>
export type GerarImagemInput = z.infer<typeof gerarImagemSchema>
