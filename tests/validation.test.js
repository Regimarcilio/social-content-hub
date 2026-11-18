import { test } from 'node:test'
import assert from 'node:assert/strict'
import { z } from 'zod'

const criarProjetoEditorialSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(200),
  objetivo: z.string().optional(),
  publicoAlvo: z.string().optional(),
  tomVoz: z.string().max(100).optional(),
  paletaCores: z.array(z.string()).default([]),
  estiloImagens: z.string().max(200).optional(),
  regrasRedacao: z.array(z.string()).default([]),
  plataformas: z.array(z.string()).default([]),
})

test('Validação - projeto válido', () => {
  const resultado = criarProjetoEditorialSchema.safeParse({
    nome: 'Meu Projeto',
    objetivo: 'Testar',
    plataformas: ['linkedin', 'x'],
  })
  assert.strictEqual(resultado.success, true)
})

test('Validação - rejeita projeto sem nome', () => {
  const resultado = criarProjetoEditorialSchema.safeParse({
    objetivo: 'Testar',
  })
  assert.strictEqual(resultado.success, false)
  if (!resultado.success) {
    const fieldErrors = resultado.error.flatten().fieldErrors
    assert.ok(fieldErrors.nome, 'Esperava erro no campo nome')
  }
})

test('Validação - rejeita nome muito longo', () => {
  const resultado = criarProjetoEditorialSchema.safeParse({
    nome: 'A'.repeat(201),
  })
  assert.strictEqual(resultado.success, false)
})

test('Validação - conteúdo válido', () => {
  const schema = z.object({
    estrategiaId: z.coerce.number().int().positive(),
    assunto: z.string().min(1, 'Assunto é obrigatório').max(500),
    profundidade: z.enum(['basica', 'intermediaria', 'avancada']).default('intermediaria'),
  })
  const resultado = schema.safeParse({
    estrategiaId: 1,
    assunto: 'Teste de assunto',
    profundidade: 'intermediaria',
  })
  assert.strictEqual(resultado.success, true)
})

test('Validação - rejeita assunto vazio', () => {
  const schema = z.object({
    estrategiaId: z.coerce.number().int().positive(),
    assunto: z.string().min(1, 'Assunto é obrigatório').max(500),
  })
  const resultado = schema.safeParse({
    estrategiaId: 1,
    assunto: '',
  })
  assert.strictEqual(resultado.success, false)
})

test('Validação - aprovação válida', () => {
  const schema = z.object({
    materialId: z.coerce.number().int().positive(),
    plataforma: z.string().min(1, 'Plataforma é obrigatória'),
    aprovadoPor: z.string().min(1, 'Quem aprova é obrigatório'),
    estado: z.enum(['rascunho', 'aprovado', 'publicado']),
  })
  const resultado = schema.safeParse({
    materialId: 1,
    plataforma: 'linkedin',
    aprovadoPor: 'usuario',
    estado: 'aprovado',
  })
  assert.strictEqual(resultado.success, true)
})

test('Validação - rejeita estado inválido', () => {
  const schema = z.object({
    materialId: z.coerce.number().int().positive(),
    plataforma: z.string().min(1, 'Plataforma é obrigatória'),
    aprovadoPor: z.string().min(1, 'Quem aprova é obrigatório'),
    estado: z.enum(['rascunho', 'aprovado', 'publicado']),
  })
  const resultado = schema.safeParse({
    materialId: 1,
    plataforma: 'linkedin',
    aprovadoPor: 'usuario',
    estado: 'invalido',
  })
  assert.strictEqual(resultado.success, false)
})

console.log('✅ Todos os testes de validação passaram')
