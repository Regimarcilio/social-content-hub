// @ts-nocheck
import { z } from 'zod'

export const criarProjetoEditorialSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(200),
  objetivo: z.string().optional(),
  publicoAlvo: z.string().optional(),
  tomVoz: z.string().max(100).optional(),
  paletaCores: z.array(z.string()).default([]),
  estiloImagens: z.string().max(200).optional(),
  regrasRedacao: z.array(z.string()).default([]),
  plataformas: z.array(z.string()).default([]),
  series: z.array(z.string()).default([]),
  referencias: z.array(z.string()).default([]),
})

export const atualizarProjetoEditorialSchema = criarProjetoEditorialSchema.partial()

export const listarProjetosEditoriaisSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
})

export type CriarProjetoEditorialInput = z.infer<typeof criarProjetoEditorialSchema>
export type AtualizarProjetoEditorialInput = z.infer<typeof atualizarProjetoEditorialSchema>
export type ListarProjetosEditoriaisInput = z.infer<typeof listarProjetosEditoriaisSchema>
