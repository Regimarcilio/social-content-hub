// @ts-nocheck
import { z } from 'zod'

export const configurarMCPSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  tipo: z.enum(['referencia', 'proprio', 'fornecedor']),
  endpoint: z.string().url().optional(),
  autenticacao: z.enum(['nenhuma', 'oauth', 'chave_api']).default('nenhuma'),
  permissoes: z.array(z.string()).default([]),
})

export const configurarPlataformaSchema = z.object({
  nome: z.enum(['linkedin', 'reddit', 'facebook', 'instagram', 'youtube', 'tiktok', 'x']),
  ativo: z.boolean().default(false),
  apiUrl: z.string().url().optional(),
  autenticacao: z.enum(['oauth2', 'chave_api', 'token']),
  credenciaisCriptografadas: z.string().min(1, 'Credenciais são obrigatórias'),
  limiteCaracteres: z.coerce.number().int().positive().optional(),
  proporcoesImagem: z.array(z.string()).default([]),
  permitePublicacaoAutomatica: z.boolean().default(false),
})

export type ConfigurarMCPInput = z.infer<typeof configurarMCPSchema>
export type ConfigurarPlataformaInput = z.infer<typeof configurarPlataformaSchema>
