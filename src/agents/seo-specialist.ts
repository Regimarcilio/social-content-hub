/**
 * Agente SEO Specialist
 *
 * Responsável por trabalhar títulos, palavras-chave, descrições e otimização
 * por plataforma.
 * Utiliza o modelo Gemma 4 31B (redação PT-BR, multilíngue).
 */

import { chamarModelo, obterModeloParaAgente, ModeloAgente } from '../ai/router'
import { db } from '../shared/db'
import { seoMetadados, conteudosGerados } from './schema'
import { eq } from 'drizzle-orm'

export interface MetadadosSEO {
  id: number
  materialId: number
  plataforma: string
  titulo: string
  palavrasChave: string[]
  descricao?: string
}

/**
 * Define metadados de SEO para um material em uma plataforma.
 */
export async function definirSeo(
  materialId: number,
  plataforma: string,
  titulo: string,
  palavrasChave: string[] = [],
  descricao?: string
): Promise<MetadadosSEO> {
  const modelo = obterModeloParaAgente(ModeloAgente.SEO)

  const [material] = await db
    .select()
    .from(conteudosGerados)
    .where(eq(conteudosGerados.id, materialId))

  if (!material) {
    throw new Error('Material não encontrado')
  }

  const mensagens = [
    {
      role: 'system',
      content: `Você é um especialista em SEO para redes sociais. Otimize títulos, palavras-chave e descrições para a plataforma informada. Responda em português brasileiro. Seja conciso e relevante.`,
    },
    {
      role: 'user',
      content: `Conteúdo: ${material.conteudoOriginal.slice(0, 1000)}...\n\nAssunto: ${material.assunto}\n\nPlataforma: ${plataforma}\n\nTítulo inicial: ${titulo}\nPalavras-chave iniciais: ${palavrasChave.join(', ')}\n\nOtimize:\n1. Título para a plataforma\n2. Palavras-chave relevantes\n3. Descrição otimizada\n\nResponda em português brasileiro.`,
    },
  ]

  const resposta = await chamarModelo({
    modelo,
    mensagens,
    temperatura: 0.5,
    maxTokens: 2000,
  })

  const texto = resposta.texto

  const tituloOtimizado = extrairCampo(texto, 'título') || titulo
  const palavrasChaveOtimizadas = extrairPalavrasChave(texto, palavrasChave)
  const descricaoOtimizada = extrairCampo(texto, 'descrição') || descricao

  const [salvo] = await db
    .insert(seoMetadados)
    .values({
      materialId,
      plataforma,
      titulo: tituloOtimizado,
      palavrasChave: palavrasChaveOtimizadas,
      descricao: descricaoOtimizada,
    })
    .returning()

  return {
    id: salvo.id,
    materialId,
    plataforma,
    titulo: salvo.titulo,
    palavrasChave: salvo.palavrasChave,
    descricao: salvo.descricao,
  }
}

/**
 * Obtém metadados SEO de um material para uma plataforma.
 */
export async function obterSeo(materialId: number, plataforma: string) {
  const [seo] = await db
    .select()
    .from(seoMetadados)
    .where(eq(seoMetadados.materialId, materialId))
    .where(eq(seoMetadados.plataforma, plataforma))

  return seo
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
 * Extrai palavras-chave da resposta do modelo.
 */
function extrairPalavrasChave(texto: string, palavrasChaveIniciais: string[]): string[] {
  const match = texto.match(/palavras.?chave[:\-]\\s*(.+)/i)
  if (!match) return palavrasChaveIniciais

  const extraídas = match[1]
    .split(/[,;]/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  return [...new Set([...palavrasChaveIniciais, ...extraídas])].slice(0, 20)
}
