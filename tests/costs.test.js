import { test } from 'node:test'
import assert from 'node:assert/strict'

test('Cálculo - custo médio por publicação', () => {
  const custos = [
    { custo: 0.001, latenciaMs: 100 },
    { custo: 0.002, latenciaMs: 200 },
    { custo: 0.003, latenciaMs: 300 },
  ]

  const mediaCusto = custos.reduce((sum, c) => sum + c.custo, 0) / custos.length
  const mediaLatencia = custos.reduce((sum, c) => sum + c.latenciaMs, 0) / custos.length

  assert.strictEqual(mediaCusto, 0.002)
  assert.strictEqual(mediaLatencia, 200)
})

test('Cálculo - verificação de limite excedido', () => {
  const verificarLimite = (usado, limite) => ({
    excedido: usado >= limite,
    usado,
    limite,
  })

  assert.strictEqual(verificarLimite(45, 50).excedido, false)
  assert.strictEqual(verificarLimite(50, 50).excedido, true)
  assert.strictEqual(verificarLimite(51, 50).excedido, true)
})

test('Cálculo - custo total por projeto', () => {
  const custosProjeto = [
    { custo: 0.01, tokensEntrada: 100, tokensSaida: 50 },
    { custo: 0.02, tokensEntrada: 200, tokensSaida: 100 },
  ]

  const totalCusto = custosProjeto.reduce((sum, c) => sum + c.custo, 0)
  const totalTokensEntrada = custosProjeto.reduce((sum, c) => sum + c.tokensEntrada, 0)
  const totalTokensSaida = custosProjeto.reduce((sum, c) => sum + c.tokensSaida, 0)

  assert.strictEqual(totalCusto, 0.03)
  assert.strictEqual(totalTokensEntrada, 300)
  assert.strictEqual(totalTokensSaida, 150)
})

console.log('✅ Todos os testes de custos passaram')
