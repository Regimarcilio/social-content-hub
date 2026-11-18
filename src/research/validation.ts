// @ts-nocheck
import { z } from 'zod'

export const criarPesquisaSchema = z.object({
  projetoId: z.coerce.number().int().positive(),
  assunto: z.string().min(1, 'Assunto é obrigatório').max(500),
  fontes: z.array(z.string().url()).default([]),
})

export const criarEstrategiaSchema = z.object({
  pesquisaId: z.coerce.number().int().positive(),
  publicoAlvo: z.string().min(1, 'Público-alvo é obrigatório'),
  objetivo: z.string().min(1, 'Objetivo é obrigatório'),
  abordagem: z.string().min(1, 'Abordagem é obrigatória'),
  tomVoz: z.string().optional(),
  plataformas: z.array(z.string()).default([]),
})

export type CriarPesquisaInput = z.infer<typeof criarPesquisaSchema>
export type CriarEstrategiaInput = z.infer<typeof criarEstrategiaSchema>
