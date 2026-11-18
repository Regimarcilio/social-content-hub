/**
 * Agente Platform Adapter
 *
 * Responsável por adaptar o conteúdo para as particularidades de cada plataforma
 * (formatação, linguagem, limite de caracteres, hashtags, títulos, descrições, imagens,
 * proporções, estrutura editorial), produzindo materiais independentes.
 * Utiliza o modelo Nemotron 3.5 Lightning (adaptação leve, alto throughput).
 */

import { chamarModelo, obterModeloParaAgente, ModeloAgente } from '../ai/router'
import { db } from '../shared/db'
import { adaptacoesPlataforma, conteudosGerados } from './schema'
import { eq } from 'drizzle-orm'

export interface AdaptacaoPlataforma {
  id: number
  plataforma: string
  conteudoAdaptado: string
  limiteCaracteres?: number
  hashtags: string[]
}

/**
 * Regras próprias por plataforma.
 */
const REGRAS_PLATAFORMA: Record<string, { limiteCaracteres?: number; formato?: string }> = {
  linkedin: { limiteCaracteres: 3000, formato: 'profissional' },
  reddit: { limiteCaracteres: 40000, formato: 'discussao_aprofundada' },
  facebook: { limiteCaracteres: 63206, formato: 'social_geral' },
  instagram: { limiteCaracteres: 2200, formato: 'visual_curto' },
  youtube: { limiteCaracteres: 5000, formato: 'video_descricao' },
  tiktok: { limiteCaracteres: 2200, formato: 'video_curto' },
  x: { limiteCaracteres: 280, formato: 'micro_conteudo' },
}

/**
 * Adapta o conteúdo para uma plataforma específica.
 */
async function adaptarParaPlataforma(
  conteudoOriginal: string,
  plataforma: string,
  assunto: string,
  palavrasChave: string[]
): Promise<AdaptacaoPlataforma> {
  const modelo = obterModeloParaAgente(ModeloAgente.PLATFORM_ADAPTER)
  const regras = REGRAS_PLATAFORMA[plataforma.toLowerCase()] || {}

  const mensagens = [
    {
      role: 'system',
      content: `Você é um especialista em adaptação de conteúdo para redes sociais. Adapte o conteúdo para a plataforma ${plataforma}, respeitando o limite de caracteres, formato, linguagem e estrutura editorial próprios de cada canal. Produza material independente, não copie o mesmo texto para todos os canais. Responda em português brasileiro.`,
    },
    {
      role: 'user',
      content: `Conteúdo original: ${conteudoOriginal}\n\nAssunto: ${assunto}\n\nPlataforma: ${plataforma}\nLimite de caracteres: ${regras.limiteCaracteres || 'não definido'}\nFormato: ${regras.formato || 'padrão'}\nPalavras-chave: ${palavrasChave.join(', ')}\n\nAdapte o conteúdo para esta plataforma, produzindo um texto independente e adequado ao canal.`,
    },
  ]

  const resposta = await chamarModelo({
    modelo,
    mensagens,
    temperatura: 0.6,
    maxTokens: 2000,
  })

  const texto = resposta.texto
  const hashtags = extrairHashtags(texto, palavrasChave)

  return {
    id: 0, // preenchido após salvar no banco
    plataforma,
    conteudoAdaptado: texto,
    limiteCaracteres: regras.limiteCaracteres,
    hashtags,
  }
}

/**
 * Adapta o conteúdo para múltiplas plataformas.
 */
export async function adaptarConteudoParaPlataformas(
  conteudoId: number,
  plataformas: string[]
): Promise<AdaptacaoPlataforma[]> {
  const [conteudo] = await db
    .select()
    .from(conteudosGerados)
    .where(eq(conteudosGerados.id, conteudoId))

  if (!conteudo) {
    throw new Error('Conteúdo não encontrado')
  }

  const resultados: AdaptacaoPlataforma[] = []

  for (const plataforma of plataformas) {
    const adaptacao = await adaptarParaPlataforma(
      conteudo.conteudoOriginal,
      plataforma,
      conteudo.assunto,
      conteudo.palavrasChave
    )

    const [salva] = await db
      .insert(adaptacoesPlataforma)
      .values({
        conteudoId,
        plataforma,
        conteudoAdaptado: adaptacao.conteudoAdaptado,
        limiteCaracteres: adaptacao.limiteCaracteres,
        hashtags: adaptacao.hashtags,
      })
      .returning()

    resultados.push({
      ...adaptacao,
      id: salva.id,
    })
  }

  return resultados
}

/**
 * Extrai hashtags do texto adaptado.
 */
function extrairHashtags(texto: string, palavrasChave: string[]): string[] {
  const hashtagsDoTexto = texto.match(/#\w+/g) || []
  const hashtagsUnicas = [...new Set(hashtagsDoTexto)]

  // Adicionar hashtags das palavras-chave que não estejam no texto
  const hashtagsPalavrasChave = palavrasChave
    .map((p) => `#${p.replace(/\s+/g, '')}`)
    .filter((h) => !hashtagsUnicas.includes(h))

  return [...hashtagsUnicas, ...hashtagsPalavrasChave].slice(0, 10)
}
