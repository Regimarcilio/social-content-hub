# Social Content Hub

Sistema de criação e gerenciamento de publicações digitais integrado ao OpenCode.

## Status

📋 **Etapa atual:** Implementação (Sprint 0 — fundação/setup)

## Estrutura

```
src/
  ai/           # Gateway de IA (router, cache semântico, RAG, guardrail)
  agents/       # Agentes especializados (Orchestrator, Researcher, ...)
  mcp/          # Servidores MCP próprios (publicação social, etc.)
  images/       # Orquestração de geração de imagem (ComfyUI / fallback)
  editorial/    # Memória editorial (projetos, materiais, versões)
  platforms/    # Adaptadores por plataforma (LinkedIn, Reddit, ...)
  shared/       # Utilitários, tipos, validações (Zod)
tests/          # Testes automatizados
prototypes/     # Protótipos navegáveis (dono @protomaster)
docker/         # Dockerfile, docker-compose
.github/        # CI/CD, workflows
docs/           # Documentação de planejamento (SRS, UML, ADRs, backlog)
```

## Regras de trabalho

- Branch de trabalho: `develop`
- Nenhuma implementação sem SRS + backlog aprovados
- Toda tela nasce protótipo (ciclo PROPOSTA → NAVEGÁVEL → VALIDADA → APROVADA → IMPLEMENTADA, dono `@protomaster`)
- Nenhuma publicação automática sem aprovação humana
- Modelos gratuitos prioritários (OpenRouter `:free`); proibida API paga da OpenAI

## Setup

```bash
cp .env.example .env
# Edite .env com suas chaves
npm install
npm run dev
```

## Documentação

Consulte `docs/` para o planejamento completo: SRS, UML, ADRs, backlog Scrum, rotina de prototipação e plano de entrega.
