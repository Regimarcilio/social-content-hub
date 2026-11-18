/**
 * Agente de Controle de Custos
 *
 * Responsável por calcular e registrar indicadores de custo por publicação
 * e por projeto, além de gerenciar limites de uso.
 */

import { db } from '../shared/db'
import {
  custosPublicacao,
  limitesUso,
  cacheSemantico,
  projetosEditoriais,
} from './schema'
import { eq, sql } from 'drizzle-orm'

export interface IndicadorCusto {
  projetoId: number
  materialId?: number
  plataforma: string
  modeloUsado: string
  tokensEntrada: number
  tokensSaida: number
  custo: number
  latenciaMs: number
}

/**
 * Registra o custo de uma publicação.
 */
export async function registrarCusto(
  projetoId: number,
  plataforma: string,
  modeloUsado: string,
  tokensEntrada: number,
  tokensSaida: number,
  custo: number,
  latenciaMs: number,
  materialId?: number
) {
  const [registro] = await db
    .insert(custosPublicacao)
    .values({
      projetoId,
      materialId,
      plataforma,
      modeloUsado,
      tokensEntrada,
      tokensSaida,
      custo: custo.toString(),
      latenciaMs,
    })
    .returning()

  return registro
}

/**
 * Calcula o custo total por projeto.
 */
export async function calcularCustoPorProjeto(projetoId: number) {
  const resultado = await db
    .select({
      totalCusto: sql<string>`COALESCE(SUM(${custosPublicacao.custo}::numeric), '0')`,
      totalTokensEntrada: sql<number>`COALESCE(SUM(${custosPublicacao.tokensEntrada}), 0)`,
      totalTokensSaida: sql<number>`COALESCE(SUM(${custosPublicacao.tokensSaida}), 0)`,
      totalPublicacoes: sql<number>`COUNT(*)`,
    })
    .from(custosPublicacao)
    .where(eq(custosPublicacao.projetoId, projetoId))

  return resultado[0]
}

/**
 * Calcula o custo por publicação (média).
 */
export async function calcularCustoPorPublicacao(projetoId: number) {
  const resultado = await db
    .select({
      mediaCusto: sql<string>`COALESCE(AVG(${custosPublicacao.custo}::numeric), '0')`,
      mediaLatencia: sql<number>`COALESCE(AVG(${custosPublicacao.latenciaMs}), 0)`,
      totalPublicacoes: sql<number>`COUNT(*)`,
    })
    .from(custosPublicacao)
    .where(eq(custosPublicacao.projetoId, projetoId))

  return resultado[0]
}

/**
 * Atualiza o uso de um limite (ex: requisições por minuto).
 */
export async function atualizarLimiteUso(
  projetoId: number,
  tipo: string,
  usado: number
) {
  const [limiteExistente] = await db
    .select()
    .from(limitesUso)
    .where(eq(limitesUso.projetoId, projetoId))
    .where(eq(limitesUso.tipo, tipo))

  if (limiteExistente) {
    const [atualizado] = await db
      .update(limitesUso)
      .set({ usado })
      .where(eq(limitesUso.id, limiteExistente.id))
      .returning()

    return atualizado
  }

  const [novo] = await db
    .insert(limitesUso)
    .values({
      projetoId,
      tipo,
      limite: 0, // será definido na configuração
      usado,
    })
    .returning()

  return novo
}

/**
 * Verifica se um limite foi excedido.
 */
export async function verificarLimite(
  projetoId: number,
  tipo: string,
  limite: number
): Promise<{ excedido: boolean; usado: number; limite: number }> {
  const [registro] = await db
    .select()
    .from(limitesUso)
    .where(eq(limitesUso.projetoId, projetoId))
    .where(eq(limitesUso.tipo, tipo))

  const usado = registro?.usado || 0
  return {
    excedido: usado >= limite,
    usado,
    limite,
  }
}

/**
 * Registra entrada no cache semântico.
 */
export async function registrarCacheSemantico(
  chave: string,
  resposta: string,
  modeloUsado: string,
  tokens: number,
  expiraEm: Date
) {
  const [registro] = await db
    .insert(cacheSemantico)
    .values({
      chave,
      resposta,
      modeloUsado,
      tokens,
      expiraEm,
    })
    .returning()

  return registro
}

/**
 * Busca entrada no cache semântico.
 */
export async function buscarCacheSemantico(chave: string) {
  const [registro] = await db
    .select()
    .from(cacheSemantico)
    .where(eq(cacheSemantico.chave, chave))
    .where(eq(cacheSemantico.expiraEm, new Date())) // simplificado; em produção comparar com agora

  return registro
}
