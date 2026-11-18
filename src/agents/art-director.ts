/**
 * Agente Art Director
 *
 * Responsável por definir a identidade visual e criar o briefing de cada imagem:
 * conceito visual, estilo artístico, composição, iluminação, paleta cromática,
 * elementos visuais, formato e proporção, coerente com a identidade editorial.
 * Utiliza o modelo Nemotron 3.5 Super VL (visão + pesquisa, contexto 1M).
 */

import { chamarModelo, obterModeloParaAgente, ModeloAgente } from '../ai/router'
import { db } from '../shared/db'
import { briefingsImagem, conteudosGerados } from './schema'
import { eq } from 'drizzle-orm'

export interface BriefingImagem {
  id: number
  conceitoVisual: string
  estiloArtistico: string
  composicao: string
  iluminacao: string
  paletaCromatica: string
  elementosVisuais: string[]
  formato: string
  proporcao: string
}

/**
 * Cria o briefing de imagem com base no conteúdo e identidade editorial.
 */
export async function criarBriefingImagem(
  conteudoId: number,
  identidadeEditorial?: {
    estiloImagens?: string
    paletaCores?: string[]
  }
): Promise<BriefingImagem> {
  const modelo = obterModeloParaAgente(ModeloAgente.ART_DIRECTOR)

  const [conteudo] = await db
    .select()
    .from(conteudosGerados)
    .where(eq(conteudosGerados.id, conteudoId))

  if (!conteudo) {
    throw new Error('Conteúdo não encontrado')
  }

  const estiloImagens = identidadeEditorial?.estiloImagens || 'Cinematográfico, sofisticado'
  const paletaCores = identidadeEditorial?.paletaCores?.join(', ') || 'Azul profundo e dourado'

  const mensagens = [
    {
      role: 'system',
      content: `Você é um diretor de arte especializado em identidade visual para redes sociais. Crie um briefing detalhado para geração de imagem, definindo conceito visual, estilo artístico, composição, iluminação, paleta cromática, elementos visuais, formato e proporção. Seja coerente com a identidade editorial. Responda em português brasileiro.`,
    },
    {
      role: 'user',
      content: `Conteúdo: ${conteudo.conteudoOriginal.slice(0, 500)}...\n\nAssunto: ${conteudo.assunto}\n\nIdentidade editorial:\n- Estilo de imagens: ${estiloImagens}\n- Paleta de cores: ${paletaCores}\n\nCrie um briefing de imagem com:\n1. Conceito visual\n2. Estilo artístico\n3. Composição\n4. Iluminação\n5. Paleta cromática\n6. Elementos visuais\n7. Formato\n8. Proporção\n\nResponda em português brasileiro.`,
    },
  ]

  const resposta = await chamarModelo({
    modelo,
    mensagens,
    temperatura: 0.6,
    maxTokens: 3000,
  })

  const texto = resposta.texto

  const briefing: BriefingImagem = {
    id: 0, // preenchido após salvar
    conceitoVisual: extrairCampo(texto, 'conceito visual') || 'Conceito baseado em ' + conteudo.assunto,
    estiloArtistico: extrairCampo(texto, 'estilo artístico') || estiloImagens,
    composicao: extrairCampo(texto, 'composição') || 'Composição equilibrada',
    iluminacao: extrairCampo(texto, 'iluminação') || 'Iluminação cinematográfica',
    paletaCromatica: extrairCampo(texto, 'paleta cromática') || paletaCores,
    elementosVisuais: extrairElementosVisuais(texto),
    formato: extrairCampo(texto, 'formato') || 'digital',
    proporcao: extrairCampo(texto, 'proporção') || '1:1',
  }

  // Salvar briefing no banco
  const [salvo] = await db
    .insert(briefingsImagem)
    .values({
      conteudoId,
      conceitoVisual: briefing.conceitoVisual,
      estiloArtistico: briefing.estiloArtistico,
      composicao: briefing.composicao,
      iluminacao: briefing.iluminacao,
      paletaCromatica: briefing.paletaCromatica,
      elementosVisuais: briefing.elementosVisuais,
      formato: briefing.formato,
      proporcao: briefing.proporcao,
    })
    .returning()

  return {
    ...briefing,
    id: salvo.id,
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
 * Extrai elementos visuais da resposta.
 */
function extrairElementosVisuais(texto: string): string[] {
  const match = texto.match(/elementos.?visuais[:\-]\\s*(.+)/i)
  if (!match) return []
  return match[1]
    .split(/[,;]/)
    .map((e) => e.trim())
    .filter((e) => e.length > 0)
}
