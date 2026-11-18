/**
 * Agente Researcher
 *
 * Responsável por pesquisar assuntos, fontes, referências e informações relevantes.
 * Utiliza o modelo Nemotron 3.5 Super VL (visão + pesquisa, contexto 1M).
 */

import { chamarModelo, obterModeloParaAgente, ModeloAgente } from '../ai/router'
import { db } from '../shared/db'
import { pesquisas } from './schema'
import { eq } from 'drizzle-orm'

export interface FontePesquisa {
  url: string
  titulo?: string
  resumo?: string
}

export interface ResultadoPesquisa {
  pesquisaId: number
  assunto: string
  fontes: FontePesquisa[]
  resumo: string
}

/**
 * Busca informações sobre um assunto usando fetch nativo.
 * Em produção, isso seria substituído por um MCP de pesquisa (Tavily/Exa/Perplexity).
 */
async function buscarFontes(assunto: string): Promise<FontePesquisa[]> {
  // Placeholder: em produção, integrar com MCP de pesquisa web
  // Por enquanto, retorna fontes vazias para o agente preencher com base no conhecimento
  return []
}

/**
 * Executa a pesquisa de um assunto.
 */
export async function pesquisarAssunto(
  projetoId: number,
  assunto: string,
  fontesIniciais: FontePesquisa[] = []
): Promise<ResultadoPesquisa> {
  const modelo = obterModeloParaAgente(ModeloAgente.RESEARCHER)

  const fontesBuscadas = await buscarFontes(assunto)
  const todasFontes = [...fontesIniciais, ...fontesBuscadas]

  const mensagens = [
    {
      role: 'system',
      content: `Você é um pesquisador especializado. Pesquise o assunto informado, identifique fontes confiáveis, referências e informações relevantes. Responda em português brasileiro. Seja objetivo e cite as fontes quando possível.`,
    },
    {
      role: 'user',
      content: `Assunto: ${assunto}\n\nFontes iniciais fornecidas: ${JSON.stringify(todasFontes)}\n\nForneça um resumo da pesquisa e liste as fontes mais relevantes.`,
    },
  ]

  const resposta = await chamarModelo({
    modelo,
    mensagens,
    temperatura: 0.3,
    maxTokens: 3000,
  })

  // Salvar pesquisa no banco
  const [pesquisa] = await db
    .insert(pesquisas)
    .values({
      projetoId,
      assunto,
      fontes: todasFontes.map((f) => ({ url: f.url, titulo: f.titulo, resumo: f.resumo })),
      resumo: resposta.texto,
    })
    .returning()

  return {
    pesquisaId: pesquisa.id,
    assunto,
    fontes: todasFontes,
    resumo: resposta.texto,
  }
}

/**
 * Obtém uma pesquisa por ID.
 */
export async function obterPesquisa(pesquisaId: number) {
  const [pesquisa] = await db.select().from(pesquisas).where(eq(pesquisas.id, pesquisaId))
  return pesquisa
}
