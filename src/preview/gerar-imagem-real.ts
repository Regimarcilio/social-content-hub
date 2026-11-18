// @ts-nocheck
// @ts-nocheck
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../shared/db'
import { briefingsImagem, imagensGeradas } from '../images/schema'

const app = new Hono()

const COMFYUI_BASE_URL = process.env.COMFYUI_BASE_URL || 'http://127.0.0.1:8188'

/**
 * Endpoint para gerar imagem real via ComfyUI
 */
app.post('/gerar-imagem-real/:briefingId', async (c) => {
  const briefingId = Number(c.req.param('briefingId'))
  const { etapa = 'definitiva' } = await c.req.json().catch(() => ({}))

  try {
    // Buscar briefing
    const [briefing] = await db
      .select()
      .from(briefingsImagem)
      .where(eq(briefingsImagem.id, briefingId))

    if (!briefing) {
      return c.json({ erro: 'Briefing não encontrado' }, 404)
    }

    // Montar prompt baseado no briefing
    const prompt = `${briefing.conceitoVisual}. ${briefing.estiloArtistico}. ${briefing.composicao}. ${briefing.iluminacao}. Paleta: ${briefing.paletaCromatica}. Elementos: ${briefing.elementosVisuais.join(', ')}. Formato: ${briefing.formato}. Proporção: ${briefing.proporcao}. Qualidade premium, resolução alta.`

    // Tentar gerar via ComfyUI
    let resultadoImagem = null
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

      if (resposta.ok) {
        const dados = await resposta.json()
        resultadoImagem = {
          caminhoArquivo: dados.caminho_arquivo || `/images/generated/${briefingId}-${etapa}.png`,
          resolucaoLargura: dados.resolucao_largura || 1024,
          resolucaoAltura: dados.resolucao_altura || 1024,
        }
      } else {
        throw new Error(`ComfyUI retornou ${resposta.status}`)
      }
    } catch (erro) {
      // Fallback: gerar placeholder SVG quando ComfyUI não está disponível
      resultadoImagem = gerarPlaceholderSVG(briefing, etapa)
    }

    // Salvar imagem gerada no banco
    const [imagem] = await db
      .insert(imagensGeradas)
      .values({
        briefingId,
        etapa,
        promptUsado: prompt,
        caminhoArquivo: resultadoImagem.caminhoArquivo,
        resolucaoLargura: resultadoImagem.resolucaoLargura,
        resolucaoAltura: resultadoImagem.resolucaoAltura,
        conceitoAvaliado: etapa === 'definitiva',
        selecionado: true,
      })
      .returning()

    return c.json({
      sucesso: true,
      imagemId: imagem.id,
      etapa,
      promptUsado: prompt,
      caminhoArquivo: imagem.caminhoArquivo,
      resolucao: `${imagem.resolucaoLargura}x${imagem.resolucaoAltura}`,
      fonte: resultadoImagem.fonte || 'comfyui',
    }, 201)
  } catch (erro) {
    return c.json({
      sucesso: false,
      erro: erro.message,
    }, 500)
  }
})

/**
 * Gerar placeholder SVG quando ComfyUI não está disponível
 */
function gerarPlaceholderSVG(briefing, etapa) {
  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1e3a8a"/>
      <circle cx="512" cy="512" r="200" fill="#d4af37" opacity="0.3"/>
      <text x="512" y="500" font-family="Arial" font-size="24" fill="#ffffff" text-anchor="middle">
        ${briefing.conceitoVisual.substring(0, 30)}...
      </text>
      <text x="512" y="540" font-family="Arial" font-size="18" fill="#d4af37" text-anchor="middle">
        ${briefing.estiloArtistico}
      </text>
      <text x="512" y="580" font-family="Arial" font-size="16" fill="#ffffff" text-anchor="middle">
        Etapa: ${etapa} | Proporção: ${briefing.proporcao}
      </text>
    </svg>
  `

  return {
    caminhoArquivo: `/images/generated/${briefing.id}-${etapa}.svg`,
    resolucaoLargura: 1024,
    resolucaoAltura: 1024,
    fonte: 'placeholder_svg',
    svg,
  }
}

export default app
