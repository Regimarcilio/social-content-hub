// @ts-nocheck
/**
 * Agente Writer
 *
 * Responsável por produzir o conteúdo original com qualidade textual e profundidade adequada.
 * Utiliza o modelo Gemma 4 31B (redação PT-BR, multilíngue).
 */

import { chamarModelo, obterModeloParaAgente, ModeloAgente } from '../ai/router'
import { db } from '../shared/db'
import { conteudosGerados } from './schema'
import { eq } from 'drizzle-orm'

export interface ConteudoOriginal {
  id: number
  assunto: string
  conteudoOriginal: string
  palavrasChave: string[]
  titulo?: string
  descricao?: string
}

/**
 * Produz conteúdo original com base na estratégia editorial.
 */
export async function gerarConteudoOriginal(
  estrategiaId: number,
  assunto: string,
  profundidade: 'basica' | 'intermediaria' | 'avancada' = 'intermediaria'
): Promise<ConteudoOriginal> {
  const modelo = obterModeloParaAgente(ModeloAgente.WRITER)

  // Buscar estratégia para contexto
  const [estrategia] = await db
    .select()
    .from(require('../research/schema').estrategias)
    .where(eq(require('../research/schema').estrategias.id, estrategiaId))

  const publicoAlvo = estrategia?.publicoAlvo || 'Não informado.'
  const objetivo = estrategia?.objetivo || 'Não informado.'
  const abordagem = estrategia?.abordagem || 'Não informado.'
  const tomVoz = estrategia?.tomVoz || 'Profissional'
  const plataformas = estrategia?.plataformas || []

  const mensagens = [
    {
      role: 'system',
      content: `Você é um redator especializado em conteúdo editorial profissional. Produza conteúdo original em português brasileiro com qualidade textual e profundidade adequada. Respeite o tom de voz, público-alvo e objetivo da estratégia editorial. Seja autoral, original e não reproduza conteúdo de terceiros.`,
    },
    {
      role: 'user',
      content: `Assunto: ${assunto}\n\nEstratégia editorial:\n- Público-alvo: ${publicoAlvo}\n- Objetivo: ${objetivo}\n- Abordagem: ${abordagem}\n- Tom de voz: ${tomVoz}\n- Plataformas: ${plataformas.join(', ')}\n- Profundidade: ${profundidade}\n\nProduza:\n1. Título sugerido\n2. Conteúdo original completo\n3. Palavras-chave relevantes\n4. Descrição curta\n\nResponda em português brasileiro.`,
    },
  ]

  const resposta = await chamarModelo({
    modelo,
    mensagens,
    temperatura: 0.7,
    maxTokens: 4000,
  })

  const texto = resposta.texto

  // Extrair campos da resposta (parsing simples; em produção usar saída estruturada)
  const titulo = extrairCampo(texto, 'título') || 'Conteúdo sobre ' + assunto
  const descricao = extrairCampo(texto, 'descrição') || ''
  const palavrasChave = extrairPalavrasChave(texto)

  // Salvar conteúdo gerado no banco
  const [conteudo] = await db
    .insert(conteudosGerados)
    .values({
      projetoId: null, // será preenchido quando houver contexto de projeto
      estrategiaId,
      assunto,
      conteudoOriginal: texto,
      palavrasChave,
      titulo,
      descricao,
    })
    .returning()

  return {
    id: conteudo.id,
    assunto,
    conteudoOriginal: texto,
    palavrasChave,
    titulo,
    descricao,
  }
}

/**
 * Extrai um campo específico da resposta do modelo.
 */
function extrairCampo(texto: string, campo: string): string | null {
  const regex = new RegExp(`${campo}[:\-]\\s*(.+)`, 'i')
  const match = texto.match(regex)
  return match ? match[1].trim() : null
}

/**
 * Extrai palavras-chave da resposta.
 */
function extrairPalavrasChave(texto: string): string[] {
  const match = texto.match(/palavras.?chave[:\-]\\s*(.+)/i)
  if (!match) return []
  return match[1]
    .split(/[,;]/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
}
