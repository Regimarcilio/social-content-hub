// @ts-nocheck
/**
 * Agente Strategist
 *
 * Responsável por definir público, objetivo, abordagem e estratégia editorial
 * com base na pesquisa e na identidade editorial do projeto.
 * Utiliza o modelo Nemotron 3 Ultra (raciocínio/orquestração, contexto 1M).
 */

import { chamarModelo, obterModeloParaAgente, ModeloAgente } from '../ai/router'
import { db } from '../shared/db'
import { estrategias } from './schema'
import { eq } from 'drizzle-orm'

export interface EstrategiaEditorial {
  publicoAlvo: string
  objetivo: string
  abordagem: string
  tomVoz?: string
  plataformas: string[]
}

/**
 * Define a estratégia editorial com base na pesquisa e identidade do projeto.
 */
export async function definirEstrategiaEditorial(
  pesquisaId: number,
  projetoId: number,
  identidadeEditorial?: {
    tomVoz?: string
    publicoAlvo?: string
    plataformas?: string[]
  }
): Promise<EstrategiaEditorial> {
  const modelo = obterModeloParaAgente(ModeloAgente.ORCHESTRATOR)

  // Buscar pesquisa e projeto para contexto
  const [pesquisa] = await db
    .select()
    .from(require('../research/schema').pesquisas)
    .where(eq(require('../research/schema').pesquisas.id, pesquisaId))

  const [projeto] = await db
    .select()
    .from(require('../editorial/schema').projetosEditoriais)
    .where(eq(require('../editorial/schema').projetosEditoriais.id, projetoId))

  const contextoPesquisa = pesquisa?.resumo || 'Sem pesquisa disponível.'
  const assunto = pesquisa?.assunto || 'Não informado.'
  const tomVozProjeto = projeto?.tomVoz || identidadeEditorial?.tomVoz || 'Profissional'
  const publicoProjeto = projeto?.publicoAlvo || identidadeEditorial?.publicoAlvo || 'Não informado.'
  const plataformasProjeto = projeto?.plataformas || identidadeEditorial?.plataformas || []

  const mensagens = [
    {
      role: 'system',
      content: `Você é um estrategista editorial. Defina público, objetivo, abordagem e estratégia editorial com base na pesquisa e na identidade editorial do projeto. Responda em português brasileiro. Seja claro, acionável e alinhado ao tom de voz do projeto.`,
    },
    {
      role: 'user',
      content: `Assunto: ${assunto}\n\nPesquisa: ${contextoPesquisa}\n\nIdentidade editorial do projeto:\n- Tom de voz: ${tomVozProjeto}\n- Público-alvo: ${publicoProjeto}\n- Plataformas: ${plataformasProjeto.join(', ')}\n\nDefina:\n1. Público-alvo específico\n2. Objetivo da publicação\n3. Abordagem editorial\n4. Tom de voz recomendado\n5. Plataformas mais adequadas\n\nResponda em formato estruturado.`,
    },
  ]

  const resposta = await chamarModelo({
    modelo,
    mensagens,
    temperatura: 0.5,
    maxTokens: 3000,
  })

  // Extrair campos da resposta (parsing simples; em produção usar saída estruturada/Zod)
  const texto = resposta.texto

  const estrategia: EstrategiaEditorial = {
    publicoAlvo: extrairCampo(texto, 'público-alvo') || publicoProjeto,
    objetivo: extrairCampo(texto, 'objetivo') || 'Publicar conteúdo sobre ' + assunto,
    abordagem: extrairCampo(texto, 'abordagem') || 'Abordagem baseada na pesquisa realizada',
    tomVoz: extrairCampo(texto, 'tom de voz') || tomVozProjeto,
    plataformas: plataformasProjeto,
  }

  // Salvar estratégia no banco
  const [estrategiaSalva] = await db
    .insert(estrategias)
    .values({
      pesquisaId,
      publicoAlvo: estrategia.publicoAlvo,
      objetivo: estrategia.objetivo,
      abordagem: estrategia.abordagem,
      tomVoz: estrategia.tomVoz,
      plataformas: estrategia.plataformas,
    })
    .returning()

  return {
    ...estrategia,
    id: estrategiaSalva.id,
  }
}

/**
 * Extrai um campo específico da resposta do modelo (parsing simples).
 */
function extrairCampo(texto: string, campo: string): string | null {
  const regex = new RegExp(`${campo}[:\-]\\s*(.+)`, 'i')
  const match = texto.match(regex)
  return match ? match[1].trim() : null
}

export interface EstrategiaComId extends EstrategiaEditorial {
  id: number
}
