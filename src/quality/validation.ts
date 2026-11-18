import { z } from 'zod'

export const revisarQualidadeSchema = z.object({
  materialId: z.coerce.number().int().positive(),
  plataforma: z.string().min(1, 'Plataforma é obrigatória'),
  revisadoPor: z.string().default('quality_reviewer'),
})

export const definirSeoSchema = z.object({
  materialId: z.coerce.number().int().positive(),
  plataforma: z.string().min(1, 'Plataforma é obrigatória'),
  titulo: z.string().min(1, 'Título é obrigatório'),
  palavrasChave: z.array(z.string()).default([]),
  descricao: z.string().optional(),
})

export const aprovarPublicacaoSchema = z.object({
  materialId: z.coerce.number().int().positive(),
  plataforma: z.string().min(1, 'Plataforma é obrigatória'),
  aprovadoPor: z.string().min(1, 'Quem aprova é obrigatório'),
  estado: z.enum(['rascunho', 'aprovado', 'publicado']),
})

export const exportarPublicacaoSchema = z.object({
  materialId: z.coerce.number().int().positive(),
  plataforma: z.string().min(1, 'Plataforma é obrigatória'),
  formato: z.enum(['json', 'markdown', 'texto']).default('json'),
  exportadoPor: z.string().min(1, 'Quem exporta é obrigatório'),
})

export type RevisarQualidadeInput = z.infer<typeof revisarQualidadeSchema>
export type DefinirSeoInput = z.infer<typeof definirSeoSchema>
export type AprovarPublicacaoInput = z.infer<typeof aprovarPublicacaoSchema>
export type ExportarPublicacaoInput = z.infer<typeof exportarPublicacaoSchema>
