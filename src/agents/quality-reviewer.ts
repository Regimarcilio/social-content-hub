/**
 * Agente Quality Reviewer
 *
 * Responsável por avaliar qualidade técnica, gramatical, editorial e visual
 * contra critérios objetivos. Se não atingir, retorna para revisão.
 * Utiliza o modelo Nemotron 3 Ultra (raciocínio, contexto 1M).
 */

import { chamarModelo, obterModeloParaAgente, ModeloAgente } from '../ai/router'
import { db } from '../shared/db'
import { revisoesQualidade, conteudosGerados, adaptacoesPlataforma } from './schema'
import { eq } from 'drizzle-orm'

export interface ResultadoRevisao {
  id: number
  materialId: number
  plataforma: string
  criterio: string
  aprovado: boolean
  nota: number
  observacoes: string
  revisadoPor: string
}

const CRITERIOS_QUALIDADE = [
  'originalidade',
  'coerencia',
  'clareza',
  'gramatica',
  'fundamentacao',
  'adequacao_plataforma',
  'identidade_editorial',
  'qualidade_visual',
  'legibilidade',
]

/**
 * Avalia a qualidade de um material contra critérios objetivos.
 */
export async function revisarQualidade(
  materialId: number,
  plataforma: string,
  revisadoPor: string = 'quality_reviewer'
): Promise<ResultadoRevisao[]> {
  const modelo = obterModeloParaAgente(ModeloAgente.QUALITY_REVIEWER)

  const [material] = await db
    .select()
    .from(conteudosGerados)
    .where(eq(conteudosGerados.id, materialId))

  if (!material) {
    throw new Error('Material não encontrado')
  }

  const [adaptacao] = await db
    .select()
    .from(adaptacoesPlataforma)
    .where(eq(adaptacoesPlataforma.conteudoId, materialId))
    .where(eq(adaptacoesPlataforma.plataforma, plataforma))

  const conteudoParaRevisar = adaptacao?.conteudoAdaptado || material.conteudoOriginal

  const mensagens = [
    {
      role: 'system',
      content: `Você é um revisor de qualidade editorial. Avalie o conteúdo contra os seguintes critérios: originalidade, coerência, clareza, gramática, fundamentação, adequação à plataforma, identidade editorial, qualidade visual e legibilidade. Para cada critério, informe se foi aprovado (true/false), uma nota de 0 a 10 e observações. Responda em português brasileiro. Seja objetivo e rigoroso.`,
    },
    {
      role: 'user',
      content: `Conteúdo para revisão:\n${conteudoParaRevisar}\n\nPlataforma: ${plataforma}\n\nAvalie cada critério da lista: ${CRITERIOS_QUALIDADE.join(', ')}.\n\nResponda em formato estruturado com: critério, aprovado (true/false), nota (0-10), observações.`,
    },
  ]

  const resposta = await chamarModelo({
    modelo,
    mensagens,
    temperatura: 0.3,
    maxTokens: 3000,
  })

  const resultados: ResultadoRevisao[] = []

  for (const criterio of CRITERIOS_QUALIDADE) {
    const aprovado = avaliarCritério(resposta.texto, criterio)
    const nota = extrairNota(resposta.texto, criterio)
    const observacoes = extrairObservacoes(resposta.texto, criterio)

    const [salvo] = await db
      .insert(revisoesQualidade)
      .values({
        materialId,
        plataforma,
        criterio,
        aprovado,
        nota,
        observacoes,
        revisadoPor,
      })
      .returning()

    resultados.push({
      id: salvo.id,
      materialId,
      plataforma,
      criterio,
      aprovado,
      nota,
      observacoes,
      revisadoPor,
    })
  }

  return resultados
}

/**
 * Verifica se todos os critérios foram aprovados.
 */
export async function todosCritériosAprovados(materialId: number, plataforma: string): Promise<boolean> {
  const revisoes = await db
    .select()
    .from(revisoesQualidade)
    .where(eq(revisoesQualidade.materialId, materialId))
    .where(eq(revisoesQualidade.plataforma, plataforma))

  if (revisoes.length === 0) return false

  return revisoes.every((r) => r.aprovado)
}

/**
 * Avalia se um critério específico foi aprovado com base na resposta do modelo.
 */
function avaliarCritério(texto: string, criterio: string): boolean {
  const regex = new RegExp(`${criterio}[:\-]\\s*(.*?)(?=\\n|$)`, 'i')
  const match = texto.match(regex)
  if (!match) return false
  const trecho = match[1].toLowerCase()
  return trecho.includes('aprovado') || trecho.includes('true') || trecho.includes('sim')
}

/**
 * Extrai a nota de um critério específico.
 */
function extrairNota(texto: string, criterio: string): number {
  const regex = new RegExp(`${criterio}[:\-]\\s*.*?nota\\s*[:=]\\s*(\\d+)`, 'i')
  const match = texto.match(regex)
  return match ? parseInt(match[1], 10) : 0
}

/**
 * Extrai observações de um critério específico.
 */
function extrairObservacoes(texto: string, criterio: string): string {
  const regex = new RegExp(`${criterio}[:\-]\\s*(.*?)(?=\\n|$)`, 'i')
  const match = texto.match(regex)
  return match ? match[1].trim() : ''
}
