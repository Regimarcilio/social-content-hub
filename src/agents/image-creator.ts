// @ts-nocheck
/**
 * Agente Image Creator
 *
 * Responsável por executar a geração e edição de imagens através das ferramentas disponíveis.
 * Trabalha em duas etapas:
 *  1. Desenvolvimento e avaliação de conceitos visuais
 *  2. Geração e finalização da imagem definitiva
 *
 * Separa claramente a geração visual dos agentes de redação.
 * Utiliza ComfyUI local (FLUX.1 [schnell] / FLUX.2 [klein] 4B) com fallback hospedado.
 */

import { db } from '../shared/db'
import { briefingsImagem, imagensGeradas } from './schema'
import { eq } from 'drizzle-orm'

export interface ImagemGerada {
  id: number
  briefingId: number
  etapa: 'conceito' | 'definitiva'
  promptUsado: string
  caminhoArquivo?: string
  resolucaoLargura?: number
  resolucaoAltura?: number
  conceitoAvaliado: boolean
  selecionado: boolean
}

const COMFYUI_BASE_URL = process.env.COMFYUI_BASE_URL || 'http://127.0.0.1:8188'

/**
 * Gera imagem em duas etapas: conceito (avaliação) → definitiva.
 * Evita múltiplas gerações sem critério de avaliação.
 */
export async function gerarImagemDuasEtapas(
  briefingId: number,
  etapa: 'conceito' | 'definitiva',
  selecionarConceito: boolean = false
): Promise<ImagemGerada> {
  const [briefing] = await db
    .select()
    .from(briefingsImagem)
    .where(eq(briefingsImagem.id, briefingId))

  if (!briefing) {
    throw new Error('Briefing de imagem não encontrado')
  }

  // Se etapa definitiva, verificar se conceito foi avaliado/selecionado
  if (etapa === 'definitiva' && !selecionarConceito) {
    const [conceitoExistente] = await db
      .select()
      .from(imagensGeradas)
      .where(eq(imagensGeradas.briefingId, briefingId))
      .where(eq(imagensGeradas.etapa, 'conceito'))

    if (!conceitoExistente || !conceitoExistente.conceitoAvaliado) {
      throw new Error('O conceito visual deve ser avaliado antes de gerar a imagem definitiva')
    }
  }

  const prompt = montarPrompt(briefing, etapa)

  // Chamar ComfyUI local (ou fallback hospedado)
  const resultado = await chamarComfyUI(prompt, etapa)

  // Salvar imagem gerada no banco
  const [imagem] = await db
    .insert(imagensGeradas)
    .values({
      briefingId,
      etapa,
      promptUsado: prompt,
      caminhoArquivo: resultado.caminhoArquivo,
      resolucaoLargura: resultado.resolucaoLargura,
      resolucaoAltura: resultado.resolucaoAltura,
      conceitoAvaliado: etapa === 'conceito' ? false : true,
      selecionado: selecionarConceito,
    })
    .returning()

  return {
    id: imagem.id,
    briefingId,
    etapa,
    promptUsado: prompt,
    caminhoArquivo: imagem.caminhoArquivo,
    resolucaoLargura: imagem.resolucaoLargura,
    resolucaoAltura: imagem.resolucaoAltura,
    conceitoAvaliado: imagem.conceitoAvaliado,
    selecionado: imagem.selecionado,
  }
}

/**
 * Avalia um conceito visual (marca como avaliado).
 */
export async function avaliarConceito(
  imagemId: number,
  aprovado: boolean
): Promise<ImagemGerada> {
  const [imagem] = await db
    .update(imagensGeradas)
    .set({ conceitoAvaliado: aprovado })
    .where(eq(imagensGeradas.id, imagemId))
    .where(eq(imagensGeradas.etapa, 'conceito'))
    .returning()

  if (!imagem) {
    throw new Error('Imagem de conceito não encontrada')
  }

  return {
    id: imagem.id,
    briefingId: imagem.briefingId,
    etapa: imagem.etapa as 'conceito' | 'definitiva',
    promptUsado: imagem.promptUsado,
    caminhoArquivo: imagem.caminhoArquivo,
    resolucaoLargura: imagem.resolucaoLargura,
    resolucaoAltura: imagem.resolucaoAltura,
    conceitoAvaliado: imagem.conceitoAvaliado,
    selecionado: imagem.selecionado,
  }
}

/**
 * Seleciona um conceito para geração da imagem definitiva.
 */
export async function selecionarConceito(imagemId: number): Promise<ImagemGerada> {
  const [imagem] = await db
    .update(imagensGeradas)
    .set({ selecionado: true })
    .where(eq(imagensGeradas.id, imagemId))
    .where(eq(imagensGeradas.etapa, 'conceito'))
    .returning()

  if (!imagem) {
    throw new Error('Imagem de conceito não encontrada')
  }

  return {
    id: imagem.id,
    briefingId: imagem.briefingId,
    etapa: imagem.etapa as 'conceito' | 'definitiva',
    promptUsado: imagem.promptUsado,
    caminhoArquivo: imagem.caminhoArquivo,
    resolucaoLargura: imagem.resolucaoLargura,
    resolucaoAltura: imagem.resolucaoAltura,
    conceitoAvaliado: imagem.conceitoAvaliado,
    selecionado: imagem.selecionado,
  }
}

/**
 * Monta o prompt de geração com base no briefing e etapa.
 */
function montarPrompt(briefing: any, etapa: 'conceito' | 'definitiva'): string {
  const base = `${briefing.conceitoVisual}. ${briefing.estiloArtistico}. ${briefing.composicao}. ${briefing.iluminacao}. Paleta: ${briefing.paletaCromatica}. Elementos: ${briefing.elementosVisuais.join(', ')}. Formato: ${briefing.formato}. Proporção: ${briefing.proporcao}.`

  if (etapa === 'conceito') {
    return `Conceito visual para avaliação: ${base} Crie 3 variações de conceito para esta imagem.`
  }

  return `Imagem definitiva: ${base} Gere a imagem final em alta resolução, pronta para publicação.`
}

/**
 * Chama o ComfyUI local para gerar a imagem.
 * Em produção, integrar com MCP de geração visual ou API do serviço hospedado.
 */
async function chamarComfyUI(prompt: string, etapa: 'conceito' | 'definitiva') {
  try {
    const resposta = await fetch(`${COMFYUI_BASE_URL}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        etapa,
        cliente: 'social-content-hub',
      }),
    })

    if (!resposta.ok) {
      throw new Error(`ComfyUI retornou ${resposta.status}`)
    }

    const dados = await resposta.json()
    return {
      caminhoArquivo: dados.caminho_arquivo || null,
      resolucaoLargura: dados.resolucao_largura || null,
      resolucaoAltura: dados.resolucao_altura || null,
    }
  } catch (erro) {
    // Fallback: retornar placeholder quando ComfyUI não estiver disponível
    console.warn('[Image Creator] ComfyUI não disponível, usando placeholder:', (erro as Error).message)
    return {
      caminhoArquivo: null,
      resolucaoLargura: null,
      resolucaoAltura: null,
    }
  }
}
