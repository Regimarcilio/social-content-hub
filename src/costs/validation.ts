import { z } from 'zod'

export const registrarCustoSchema = z.object({
  projetoId: z.coerce.number().int().positive(),
  materialId: z.coerce.number().int().positive().optional(),
  plataforma: z.string().min(1, 'Plataforma é obrigatória'),
  modeloUsado: z.string().min(1, 'Modelo é obrigatório'),
  tokensEntrada: z.coerce.number().int().nonnegative().default(0),
  tokensSaida: z.coerce.number().int().nonnegative().default(0),
  custo: z.string().min(1, 'Custo é obrigatório'),
  latenciaMs: z.coerce.number().int().nonnegative().default(0),
})

export const atualizarLimiteUsoSchema = z.object({
  projetoId: z.coerce.number().int().positive(),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  usado: z.coerce.number().int().nonnegative(),
})

export type RegistrarCustoInput = z.infer<typeof registrarCustoSchema>
export type AtualizarLimiteUsoInput = z.infer<typeof atualizarLimiteUsoSchema>
