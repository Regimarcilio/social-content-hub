// @ts-nocheck
/**
 * Router de Modelos Gratuitos (OpenRouter)
 *
 * Permite que cada agente utilize um modelo apropriado à sua responsabilidade,
 * com fallback automático e cache semântico para evitar chamadas desnecessárias.
 */

import { z } from 'zod'

const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

if (!OPENROUTER_API_KEY) {
  console.warn('[ModelRouter] OPENROUTER_API_KEY não definida. Chamadas ao modelo falharão.')
}

// Modelos por agente (variantes :free, US$ 0/M)
export const MODELOS = {
  ORCHESTRATOR: 'nvidia/nemotron-3-ultra-550b-a55b:free',
  RESEARCHER: 'nvidia/nemotron-3.5-super-vl:free',
  WRITER: 'google/gemma-4-31b-it:free',
  PLATFORM_ADAPTER: 'nvidia/nemotron-3.5-lightning:free',
  ART_DIRECTOR: 'nvidia/nemotron-3.5-super-vl:free',
  QUALITY_REVIEWER: 'nvidia/nemotron-3-ultra-550b-a55b:free',
  SEO: 'google/gemma-4-31b-it:free',
} as const

export type ModeloAgente = keyof typeof MODELOS

// Cache semântico simples (em memória) para evitar chamadas desnecessárias
interface CacheEntry {
  resposta: string
  timestamp: number
  tokens: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hora

function gerarCacheKey(modelo: string, mensagens: any[]): string {
  const payload = JSON.stringify({ modelo, mensagens })
  let hash = 0
  for (let i = 0; i < payload.length; i++) {
    hash = (hash << 5) - hash + payload.charCodeAt(i)
    hash |= 0
  }
  return String(hash)
}

export interface ChamadaModelo {
  modelo: string
  mensagens: any[]
  temperatura?: number
  maxTokens?: number
  stream?: boolean
}

export interface RespostaModelo {
  texto: string
  modeloUsado: string
  tokensEntrada: number
  tokensSaida: number
  custo: number
  latenciaMs: number
  cacheHit: boolean
}

/**
 * Chama um modelo gratuito via OpenRouter com cache semântico e registro de custo.
 */
export async function chamarModelo(params: ChamadaModelo): Promise<RespostaModelo> {
  const inicio = Date.now()
  const { modelo, mensagens, temperatura = 0.7, maxTokens = 2000 } = params

  const cacheKey = gerarCacheKey(modelo, mensagens)
  const entradaCache = cache.get(cacheKey)

  if (entradaCache && Date.now() - entradaCache.timestamp < CACHE_TTL_MS) {
    return {
      texto: entradaCache.resposta,
      modeloUsado: modelo,
      tokensEntrada: 0,
      tokensSaida: 0,
      custo: 0,
      latenciaMs: Date.now() - inicio,
      cacheHit: true,
    }
  }

  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY não configurada. Não é possível chamar o modelo.')
  }

  const resposta = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/Regimarcilio/social-content-hub',
      'X-Title': 'Social Content Hub',
    },
    body: JSON.stringify({
      model: modelo,
      messages: mensagens,
      temperature: temperatura,
      max_tokens: maxTokens,
    }),
  })

  if (!resposta.ok) {
    const erroTexto = await resposta.text()
    throw new Error(`Erro ao chamar modelo ${modelo}: ${resposta.status} ${erroTexto}`)
  }

  const dados = await resposta.json()
  const texto = dados.choices?.[0]?.message?.content || ''
  const uso = dados.usage || {}
  const tokensEntrada = uso.prompt_tokens || 0
  const tokensSaida = uso.completion_tokens || 0

  // Custo: modelos :free são US$ 0/M, mas registramos para rastreabilidade
  const custo = 0

  const latenciaMs = Date.now() - inicio

  const entrada: CacheEntry = {
    resposta: texto,
    timestamp: Date.now(),
    tokens: tokensEntrada + tokensSaida,
  }
  cache.set(cacheKey, entrada)

  return {
    texto,
    modeloUsado: modelo,
    tokensEntrada,
    tokensSaida,
    custo,
    latenciaMs,
    cacheHit: false,
  }
}

/**
 * Obtém o modelo apropriado para um agente.
 */
export function obterModeloParaAgente(agente: ModeloAgente): string {
  return MODELOS[agente]
}

/**
 * Limpa o cache semântico.
 */
export function limparCache(): void {
  cache.clear()
}

/**
 * Retorna estatísticas do cache.
 */
export function estatisticasCache(): { tamanho: number; chaves: string[] } {
  return { tamanho: cache.size, chaves: Array.from(cache.keys()) }
}
