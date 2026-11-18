# DevLog — Social Content Hub

> **Projeto:** Social Content Hub  
> **Diário de bordo append-only** (skill devlog)  
> **Branch:** `DOC`  
> **Registro de todo despacho com `task_id`, decisões, arquivos e testes.**

---

## Entrada 1 — Planejamento (esta etapa)

**task_id:** PLAN-001  
**Data:** 17/11/2026  
**Responsável:** PLANMASTER (agente de planejamento)  
**Tipo:** Planejamento técnico completo (FASE 0 a FASE 6)

### Decisões tomadas
- Branch de trabalho: `DOC` (documentação), integração prevista para `develop`.
- Stack de implementação: a definir com o usuário (candidatos: Node/TypeScript ou Python).
- Modelos: exclusivamente gratuitos via OpenRouter (variantes `:free`); proibida API paga da OpenAI (ADR-001).
- Geração de imagem: ComfyUI local + FLUX.1 [schnell] / FLUX.2 [klein] 4B (Apache 2.0); hospedado (Leonardo AI / Firefly) como fallback (ADR-002).
- MCP: Filesystem, Fetch, Git (referência oficial); pesquisa web via servidores oficiais de fornecedor; publicação social via MCP próprio ou API direta (ADR-003).
- Arquitetura: multiagente com orquestrador central (Content Orchestrator) + 8 especialistas, sem redundância (ADR-004).
- Estados de publicação: Rascunho → Aprovado → Publicado; aprovação humana obrigatória; exportação para publicação manual (ADR-005).

### Arquivos criados
- `docs/social-content-hub/01-visao-e-escopo.md` — Visão e escopo (FASE 1)
- `docs/social-content-hub/02-benchmarks.md` — Benchmarks de modelos, imagem e MCP (FASE 2)
- `docs/social-content-hub/SRS.md` — SRS completo com RF, RNF, RN, matriz de rastreabilidade, riscos (FASE 3)
- `docs/social-content-hub/03-arquitetura-e-uml.md` — Arquitetura e diagramas UML em Mermaid (FASE 4)
- `docs/social-content-hub/04-ADRs/ADR-001-modelos-gratuitos.md`
- `docs/social-content-hub/04-ADRs/ADR-002-geracao-imagens.md`
- `docs/social-content-hub/04-ADRs/ADR-003-servidores-mcp.md`
- `docs/social-content-hub/04-ADRs/ADR-004-arquitetura-multiagente.md`
- `docs/social-content-hub/04-ADRs/ADR-005-estados-publicacao.md`
- `docs/social-content-hub/05-backlog.md` — Backlog Scrum, épicos, User Stories, sprints, mapa de telas, plano de testes (FASE 5)
- `docs/social-content-hub/04-rotina-prototipacao-telas.md` — Ciclo de vida da tela, ritual DEV-proto-<slug>, regras duras, DoR condicionado (FASE 5)
- `docs/social-content-hub/06-plano-de-entrega.md` — Estrutura de pastas, comandos de setup, estratégia de branches, CI, checklist de DoD, critérios para autorizar implementação (FASE 6)
- `docs/social-content-hub/dev-log.md` — Este diário de bordo

### Testes
- Nenhum teste de código executado (esta etapa é exclusivamente de planejamento).
- Validação de benchmarks feita via pesquisa web (websearch/webfetch) com fontes oficiais (OpenRouter, modelcontextprotocol/servers, documentação de licenças de modelos de imagem).

### Próximos passos
- Apresentar resumo executivo ao usuário.
- Aguardar confirmação para iniciar a Sprint 0 (validação de planejamento) e Sprint 1 (memória editorial).
- Ao iniciar implementação, criar branch `feature/*` a partir de `develop` e registrar cada despacho neste dev-log.

---

*Fim da entrada 1. Novos despachos serão adicionados abaixo, em ordem cronológica, nunca sobrescrevendo entradas anteriores.*
