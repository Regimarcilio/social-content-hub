/**
 * Agente de Memória Editorial
 *
 * Responsável por gerenciar versões de materiais, histórico de publicações
 * e continuidade entre séries editoriais.
 */

import { db } from '../shared/db'
import {
  versoesMaterial,
  historicoPublicacoes,
  seriesEditoriais,
  conteudosGerados,
  projetosEditoriais,
} from './schema'
import { eq } from 'drizzle-orm'

export interface VersaoMaterial {
  id: number
  materialId: number
  versao: number
  conteudo: Record<string, unknown>
  alteracoes?: string
  criadoPor: string
  criadoEm: Date
}

/**
 * Cria uma nova versão de um material.
 */
export async function criarVersao(
  materialId: number,
  versao: number,
  conteudo: Record<string, unknown>,
  alteracoes: string,
  criadoPor: string
): Promise<VersaoMaterial> {
  const [versaoSalva] = await db
    .insert(versoesMaterial)
    .values({
      materialId,
      versao,
      conteudo,
      alteracoes,
      criadoPor,
    })
    .returning()

  return {
    id: versaoSalva.id,
    materialId: versaoSalva.materialId,
    versao: versaoSalva.versao,
    conteudo: versaoSalva.conteudo as Record<string, unknown>,
    alteracoes: versaoSalva.alteracoes,
    criadoPor: versaoSalva.criadoPor,
    criadoEm: versaoSalva.criadoEm,
  }
}

/**
 * Lista todas as versões de um material.
 */
export async function listarVersoes(materialId: number): Promise<VersaoMaterial[]> {
  const lista = await db
    .select()
    .from(versoesMaterial)
    .where(eq(versoesMaterial.materialId, materialId))

  return lista.map((v) => ({
    id: v.id,
    materialId: v.materialId,
    versao: v.versao,
    conteudo: v.conteudo as Record<string, unknown>,
    alteracoes: v.alteracoes,
    criadoPor: v.criadoPor,
    criadoEm: v.criadoEm,
  }))
}

/**
 * Registra uma publicação no histórico.
 */
export async function registrarPublicacaoHistorico(
  projetoId: number,
  materialId: number,
  plataforma: string,
  estado: string,
  urlPublicacao?: string
) {
  const [registro] = await db
    .insert(historicoPublicacoes)
    .values({
      projetoId,
      materialId,
      plataforma,
      estado,
      urlPublicacao,
    })
    .returning()

  return registro
}

/**
 * Lista o histórico de publicações de um projeto.
 */
export async function listarHistoricoPublicacoes(projetoId: number) {
  const lista = await db
    .select()
    .from(historicoPublicacoes)
    .where(eq(historicoPublicacoes.projetoId, projetoId))

  return lista
}

/**
 * Cria ou atualiza uma série editorial.
 */
export async function criarOuAtualizarSerieEditorial(
  projetoId: number,
  nome: string,
  descricao: string,
  numeroEpisodio: number
) {
  const [serieExistente] = await db
    .select()
    .from(seriesEditoriais)
    .where(eq(seriesEditoriais.projetoId, projetoId))
    .where(eq(seriesEditoriais.nome, nome))

  if (serieExistente) {
    const [atualizada] = await db
      .update(seriesEditoriais)
      .set({
        descricao,
        numeroEpisodio: serieExistente.numeroEpisodio + 1,
      })
      .where(eq(seriesEditoriais.id, serieExistente.id))
      .returning()

    return atualizada
  }

  const [nova] = await db
    .insert(seriesEditoriais)
    .values({
      projetoId,
      nome,
      descricao,
      numeroEpisodio,
    })
    .returning()

  return nova
}

/**
 * Obtém a continuidade de uma série (último episódio).
 */
export async function obterContinuidadeSerie(projetoId: number, nomeSerie: string) {
  const [serie] = await db
    .select()
    .from(seriesEditoriais)
    .where(eq(seriesEditoriais.projetoId, projetoId))
    .where(eq(seriesEditoriais.nome, nomeSerie))

  return serie
}
