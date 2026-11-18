// @ts-nocheck
import { z } from 'zod'

export const criarVersaoSchema = z.object({
  materialId: z.coerce.number().int().positive(),
  versao: z.coerce.number().int().positive(),
  conteudo: z.record(z.string(), z.any()).default({}),
  alteracoes: z.string().optional(),
  criadoPor: z.string().min(1, 'Quem criou é obrigatório'),
})

export const registrarPublicacaoSchema = z.object({
  projetoId: z.coerce.number().int().positive(),
  materialId: z.coerce.number().int().positive(),
  plataforma: z.string().min(1, 'Plataforma é obrigatória'),
  estado: z.enum(['rascunho', 'aprovado', 'publicado']),
  urlPublicacao: z.string().url().optional(),
})

export const custoPublicacaoSchema = z.object({
  projetoId: z.coerce.number().int().positive(),
  materialId: z.coerce.number().int().positive(),
  plataforma: z.string().min(1, 'Plataforma é obrigatória'),
  modeloUsado: z.string().min(1, 'Modelo é obrigatório'),
  tokensEntrada: z.coerce.number().int().nonnegative().default(0),
  tokensSaida: z.coerce.number().int().nonnegative().default(0),
  custo: z.coerce.number().nonnegative().default(0),
  latenciaMs: z.coerce.number().int().nonnegative().default(0),
})

export type CriarVersaoInput = z.infer<typeof criarVersaoSchema>
export type RegistrarPublicacaoInput = z.infer<typeof registrarPublicacaoSchema>
export type CustoPublicacaoInput = z.infer<typeof custoPublicacaoSchema>
