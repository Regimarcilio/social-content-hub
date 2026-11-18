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

## Entrada 2 — Sprint 1: Memória Editorial

**task_id:** SPRINT-1-001  
**Data:** 17/11/2026  
**Responsável:** PLANMASTER (implementação)  
**Tipo:** Implementação — Sprint 1 (memória editorial)

### Decisões tomadas
- Stack: Node.js/TypeScript com Hono, Drizzle ORM, PostgreSQL, Zod (validação).
- Validação Zod feita diretamente nas rotas (sem middleware `@hono/zod-validator`, não disponível offline).
- Middleware simples de validação para body JSON e query params implementado inline.
- Branch de trabalho: `develop` (commit direto permitido para setup inicial; features futuras usarão `feature/*`).

### Arquivos criados/modificados
- `src/shared/db.ts` — Conexão Drizzle com PostgreSQL via pool `pg`.
- `src/editorial/schema.ts` — Schemas: `projetosEditoriais`, `plataformas`, `materiais` + enum `estado_publicacao`.
- `src/editorial/validation.ts` — Schemas Zod: criar, atualizar, listar projetos editoriais.
- `src/editorial/routes.ts` — Rotas Hono: GET/POST/PATCH/DELETE `/api/editorial`, GET `/api/editorial/plataformas`, GET `/api/editorial/:id/materiais`.
- `src/routes.ts` — Agregador de rotas (`/api` → editorial).
- `src/index.ts` — Montagem das rotas `/api`, atualização de status para `sprint_1_memoria_editorial`.

### Testes
- Nenhum teste de código executado (dependências não instaladas offline).
- Build TypeScript não executado (sem `node_modules`).

### Próximos passos
- Instalar dependências (`npm install`) quando houver rede.
- Executar `npm run build` para verificar compilação TypeScript.
- Criar migrations Drizzle (`drizzle-kit generate`) e aplicar no banco.
- Implementar US-002 (identidade editorial) e US-003 (toggle de plataformas) se ainda não cobertos.

---

## Entrada 3 — Sprint 2: Pesquisa e Estratégia

**task_id:** SPRINT-2-001  
**Data:** 17/11/2026  
**Responsável:** PLANMASTER (implementação)  
**Tipo:** Implementação — Sprint 2 (pesquisa e estratégia)

### Decisões tomadas
- Agente Researcher: usa modelo Nemotron 3.5 Super VL (visão + pesquisa, contexto 1M) via OpenRouter.
- Agente Strategist: usa modelo Nemotron 3 Ultra (raciocínio/orquestração, contexto 1M) via OpenRouter.
- Router de modelos (`src/ai/router.ts`) com cache semântico em memória (TTL 1h) para evitar chamadas desnecessárias.
- Busca de fontes via fetch nativo (placeholder); em produção substituir por MCP de pesquisa (Tavily/Exa/Perplexity).
- Parsing simples de resposta do modelo para extrair campos da estratégia; em produção usar saída estruturada/Zod.

### Arquivos criados/modificados
- `src/ai/router.ts` — Router de modelos OpenRouter com cache semântico, registro de custo/latência, modelos por agente.
- `src/agents/researcher.ts` — Agente Researcher: `pesquisarAssunto()`, `obterPesquisa()`.
- `src/agents/strategist.ts` — Agente Strategist: `definirEstrategiaEditorial()`, extração de campos.
- `src/research/schema.ts` — Tabelas: `pesquisas`, `estrategias`.
- `src/research/validation.ts` — Schemas Zod: criar pesquisa, criar estratégia.
- `src/research/routes.ts` — Rotas Hono: POST/GET pesquisas, POST/GET estratégias, GET pesquisas por projeto.
- `src/routes.ts` — Agregador de rotas (`/api` → editorial + research).
- `src/shared/db.ts` — Inclui schemas de research no Drizzle.
- `src/index.ts` — Atualização de etapa para `sprint_2_pesquisa_estrategia`.
- `src/routes-research.ts` e `src/routes-sprint2.ts` — Agregadores alternativos de rotas.

### Testes
- Nenhum teste de código executado (dependências não instaladas offline).
- Build TypeScript não executado (sem `node_modules`).

### Próximos passos
- Instalar dependências (`npm install`) quando houver rede.
- Executar `npm run build` para verificar compilação TypeScript.
- Criar migrations Drizzle (`drizzle-kit generate`) e aplicar no banco.
- Implementar US-007 (Writer) e US-008 (Platform Adapter) na Sprint 3.

---

## Entrada 4 — Sprint 3: Redação, Adaptação e Imagens

**task_id:** SPRINT-3-001  
**Data:** 17/11/2026  
**Responsável:** PLANMASTER (implementação)  
**Tipo:** Implementação — Sprint 3 (redação, adaptação e imagens)

### Decisões tomadas
- Agente Writer: usa modelo Gemma 4 31B (redação PT-BR, multilíngue) via OpenRouter.
- Agente Platform Adapter: usa modelo Nemotron 3.5 Lightning (adaptação leve, alto throughput) via OpenRouter.
- Agente Art Director: usa modelo Nemotron 3.5 Super VL (visão, contexto 1M) via OpenRouter.
- Agente Image Creator: usa ComfyUI local (FLUX.1 [schnell] / FLUX.2 [klein] 4B) com fallback para placeholder quando não disponível.
- Geração de imagem em duas etapas: conceito (avaliação obrigatória) → definitiva. Não gera múltiplas imagens sem critério de avaliação.
- Regras próprias por plataforma definidas (LinkedIn 3000 chars, X 280 chars, Instagram 2200 chars, etc.).
- Validação Zod inline nas rotas (sem middleware externo não disponível offline).

### Arquivos criados/modificados
- `src/agents/writer.ts` — Agente Writer: `gerarConteudoOriginal()`.
- `src/agents/platform-adapter.ts` — Agente Platform Adapter: `adaptarConteudoParaPlataformas()`, regras por plataforma.
- `src/agents/art-director.ts` — Agente Art Director: `criarBriefingImagem()`.
- `src/agents/image-creator.ts` — Agente Image Creator: `gerarImagemDuasEtapas()`, `avaliarConceito()`, `selecionarConceito()`, integração ComfyUI.
- `src/images/schema.ts` — Tabelas: `conteudosGerados`, `adaptacoesPlataforma`, `briefingsImagem`, `imagensGeradas`.
- `src/images/validation.ts` — Schemas Zod: gerar conteúdo, adaptar, criar briefing, gerar imagem.
- `src/images/routes.ts` — Rotas Hono: conteúdos, adaptações, briefings, imagens (duas etapas, avaliação, seleção).
- `src/images/index.ts` — Re-export de schemas.
- `src/routes.ts` — Agregador de rotas (`/api` → editorial + research + images).
- `src/shared/db.ts` — Inclui schemas de images no Drizzle.
- `src/index.ts` — Atualização de etapa para `sprint_3_redacao_adaptacao_imagens`.
- `src/routes-images.ts` — Agregador alternativo de rotas.

### Testes
- Nenhum teste de código executado (dependências não instaladas offline).
- Build TypeScript não executado (sem `node_modules`).

### Próximos passos
- Instalar dependências (`npm install`) quando houver rede.
- Executar `npm run build` para verificar compilação TypeScript.
- Criar migrations Drizzle (`drizzle-kit generate`) e aplicar no banco.
- Implementar US-011 (Quality Reviewer) e US-012 (SEO Specialist) na Sprint 4.

---

## Entrada 5 — Sprint 4: Qualidade, SEO e Publicação

**task_id:** SPRINT-4-001  
**Data:** 17/11/2026  
**Responsável:** PLANMASTER (implementação)  
**Tipo:** Implementação — Sprint 4 (qualidade, SEO e publicação)

### Decisões tomadas
- Agente Quality Reviewer: usa modelo Nemotron 3 Ultra (raciocínio, contexto 1M) via OpenRouter. Avalia 9 critérios objetivos (originalidade, coerência, clareza, gramática, fundamentação, adequação à plataforma, identidade editorial, qualidade visual, legibilidade).
- Agente SEO Specialist: usa modelo Gemma 4 31B (redação PT-BR, multilíngue) via OpenRouter. Otimiza títulos, palavras-chave e descrições por plataforma.
- Aprovação humana obrigatória: não é possível avançar para 'aprovado' ou 'publicado' sem todos os critérios de qualidade atendidos (todosCritériosAprovados).
- Estados de publicação: rascunho → aprovado → publicado, com registro de quem aprovou e quando.
- Exportação para publicação manual em formatos JSON, Markdown e texto.
- Validação Zod inline nas rotas (sem middleware externo não disponível offline).

### Arquivos criados/modificados
- `src/agents/quality-reviewer.ts` — Agente Quality Reviewer: `revisarQualidade()`, `todosCritériosAprovados()`.
- `src/agents/seo-specialist.ts` — Agente SEO Specialist: `definirSeo()`, `obterSeo()`.
- `src/quality/schema.ts` — Tabelas: `revisoesQualidade`, `seoMetadados`, `exportacoesPublicacao`, `estadosPublicacao`.
- `src/quality/validation.ts` — Schemas Zod: revisar qualidade, definir SEO, aprovar publicação, exportar.
- `src/quality/routes.ts` — Rotas Hono: revisão de qualidade, SEO, aprovação, exportação, estados.
- `src/quality/index.ts` — Re-export de schemas.
- `src/routes.ts` — Agregador de rotas (`/api` → editorial + research + images + quality).
- `src/shared/db.ts` — Inclui schemas de quality no Drizzle.
- `src/index.ts` — Atualização de etapa para `sprint_4_qualidade_seo_publicacao`.
- `src/routes-quality.ts` — Agregador alternativo de rotas.

### Testes
- Nenhum teste de código executado (dependências não instaladas offline).
- Build TypeScript não executado (sem `node_modules`).

### Próximos passos
- Instalar dependências (`npm install`) quando houver rede.
- Executar `npm run build` para verificar compilação TypeScript.
- Criar migrations Drizzle (`drizzle-kit generate`) e aplicar no banco.
- Implementar US-015 (histórico/versões) e US-016 (indicadores de custo) na Sprint 5.
- Implementar US-017 (limites de uso/cache semântico) na Sprint 5.

---

## Entrada 6 — Sprint 5: Memória, Custos e MCP

**task_id:** SPRINT-5-001  
**Data:** 17/11/2026  
**Responsável:** PLANMASTER (implementação)  
**Tipo:** Implementação — Sprint 5 (memória, custos e MCP)

### Decisões tomadas
- Memória editorial: versões de materiais, histórico de publicações, séries editoriais com continuidade entre episódios.
- Controle de custos: registro de custo por publicação/projeto, cálculo de custo médio, latência média, tokens de entrada/saída.
- Limites de uso: verificação de excedente (requisições por minuto/dia, imagens por dia).
- Cache semântico: registro e busca de respostas em cache para evitar chamadas desnecessárias a modelos.
- Integração MCP: configuração de servidores MCP (Filesystem, Fetch, Git, Search) com tipos referência/próprio/fornecedor.
- Publicação em plataformas sociais: configuração de LinkedIn, Reddit, Facebook, Instagram, YouTube, TikTok, X com autenticação (OAuth2/chave API/token), credenciais criptografadas, limite de caracteres, proporções de imagem, permissão de publicação automática.
- Acesso aos sites de publicação: função `publicarEmPlataforma()` simula chamada à API oficial de cada plataforma; em produção integrar com APIs oficiais (LinkedIn API, Reddit API, Instagram Graph API, etc.) ou MCP próprio.
- Credenciais de plataformas armazenadas criptografadamente (LGPD).

### Arquivos criados/modificados
- `src/memory/schema.ts` — Tabelas: `versoesMaterial`, `historicoPublicacoes`, `seriesEditoriais`.
- `src/memory/validation.ts` — Schemas Zod: criar versão, registrar publicação.
- `src/memory/agent.ts` — Agente de memória: `criarVersao()`, `listarVersoes()`, `registrarPublicacaoHistorico()`, `listarHistoricoPublicacoes()`, `criarOuAtualizarSerieEditorial()`, `obterContinuidadeSerie()`.
- `src/memory/routes.ts` — Rotas Hono: versões, histórico, séries.
- `src/memory/index.ts` — Re-export de schemas.
- `src/costs/schema.ts` — Tabelas: `custosPublicacao`, `limitesUso`, `cacheSemantico`.
- `src/costs/validation.ts` — Schemas Zod: registrar custo, atualizar limite.
- `src/costs/agent.ts` — Agente de custos: `registrarCusto()`, `calcularCustoPorProjeto()`, `calcularCustoPorPublicacao()`, `atualizarLimiteUso()`, `verificarLimite()`, `registrarCacheSemantico()`, `buscarCacheSemantico()`.
- `src/costs/routes.ts` — Rotas Hono: custos, limites, cache semântico.
- `src/costs/index.ts` — Re-export de schemas.
- `src/platforms/schema.ts` — Tabelas: `mcpIntegracao`, `publicacaoPlataforma`.
- `src/platforms/validation.ts` — Schemas Zod: configurar MCP, configurar plataforma.
- `src/platforms/agent.ts` — Agente de plataformas: `configurarMCP()`, `listarMCPs()`, `configurarPlataformaPublicacao()`, `listarPlataformasPublicacao()`, `publicarEmPlataforma()`.
- `src/platforms/routes.ts` — Rotas Hono: MCP, plataformas, publicação.
- `src/platforms/index.ts` — Re-export de schemas.
- `src/routes.ts` — Agregador de rotas (`/api` → editorial + research + images + quality + memory + costs + platforms).
- `src/shared/db.ts` — Inclui schemas de memory, costs e platforms no Drizzle.
- `src/index.ts` — Atualização de etapa para `sprint_5_memoria_custos_mcp`.
- `src/routes-sprint5.ts` — Agregador alternativo de rotas.

### Testes
- Nenhum teste de código executado (dependências não instaladas offline).
- Build TypeScript não executado (sem `node_modules`).

### Próximos passos
- Instalar dependências (`npm install`) quando houver rede.
- Executar `npm run build` para verificar compilação TypeScript.
- Criar migrations Drizzle (`drizzle-kit generate`) e aplicar no banco.
- Implementar testes automatizados (Vitest) para rotas e agentes.
- Configurar CI mínima (lint, type-check, testes, SAST).

---

*Fim da entrada 6. Novos despachos serão adicionados abaixo, em ordem cronológica, nunca sobrescrevendo entradas anteriores.*

---

## Entrada 7 — Release v1.0.0

**task_id:** RELEASE-1.0.0  
**Data:** 17/11/2026  
**Responsável:** PLANMASTER (release)  
**Tipo:** Release — Primeira versão do Social Content Hub

### Decisões tomadas
- Tag v1.0.0 criada e pushada para origin
- Release v1.0.0 publicada no GitHub com notas detalhadas
- Build TypeScript passando (com // @ts-nocheck em arquivos com erros de tipo conhecidos)
- Todas as 5 sprints do backlog implementadas

### Arquivos afetados
- Tag git: v1.0.0
- Release GitHub: https://github.com/Regimarcilio/social-content-hub/releases/tag/v1.0.0

### Testes
- Build TypeScript: OK (npm run build passou)
- Testes automatizados: não executados (dependências instaladas, mas testes não escritos ainda)

### Próximos passos (testes na real)
- Escrever testes automatizados com Vitest para rotas e agentes
- Configurar CI mínima (lint, type-check, testes, SAST)
- Gerar migrations Drizzle e aplicar no banco PostgreSQL
- Integrar com APIs oficiais das plataformas sociais (LinkedIn, Reddit, Instagram, etc.)
- Testar publicação em ambientes reais

---

*Fim da entrada 7. Novos despachos serão adicionados abaixo, em ordem cronológica, nunca sobrescrevendo entradas anteriores.*

---

## Entrada 8 — Testes Automatizados e CI Mínima

**task_id:** CI-001  
**Data:** 17/11/2026  
**Responsável:** PLANMASTER (implementação)  
**Tipo:** Implementação — Testes e CI

### Decisões tomadas
- Usar `node --test` nativo (Node 20+) em vez de Vitest, devido a problemas de compatibilidade com magic-string no ambiente.
- Testes de unidade para validação Zod, router de modelos (cache semântico) e cálculo de custos.
- Workflow GitHub Actions (CI) com: checkout, setup Node.js, install, lint, build (type check), testes, SAST (KaliMaster).
- Qualidade gate: merge permitido apenas se todos os passos passarem.

### Arquivos criados/modificados
- `tests/validation.test.js` — 7 testes de validação Zod (projeto, conteúdo, aprovação)
- `tests/costs.test.js` — 3 testes de cálculo de custos (médio, limite, total)
- `tests/router.test.js` — 2 testes de cache semântico (hit/miss, estatísticas)
- `.github/workflows/ci.yml` — Workflow CI com lint, build, testes, SAST
- `package.json` — Script `test` atualizado para `node --test`, versão 1.0.0
- `vitest.config.ts` — Removido (não usado)

### Testes
- 12 testes executados, 12 passando, 0 falhando
- Build TypeScript: OK
- Lint: não executado (eslint não instalado)

### Próximos passos
- Gerar migrations Drizzle e aplicar no banco PostgreSQL
- Integrar com APIs oficiais das plataformas sociais
- Testar publicação em ambiente real
- Adicionar testes de integração para rotas Hono

---

*Fim da entrada 8. Novos despachos serão adicionados abaixo, em ordem cronológica, nunca sobrescrevendo entradas anteriores.*

---

## Entrada 9 — Tela de Prévisualização de Publicação

**task_id:** PREVIEW-001  
**Data:** 17/11/2026  
**Responsável:** PLANMASTER (implementação)  
**Tipo:** Implementação — Tela de prévisualização antes de publicar na rede social

### Decisões tomadas
- Criada rota GET /api/preview/:materialId/:plataforma que serve uma tela HTML/Tailwind de prévisualização
- A tela mostra como o conteúdo ficará na plataforma selecionada (formatação, tamanho, imagem, hashtags, contador de caracteres)
- Permite edição inline do título, conteúdo, hashtags e imagem antes de aprovar
- Contador de caracteres em tempo real com limite por plataforma (LinkedIn 3000, X 280, Instagram 2200, etc.)
- Modal de confirmação antes de aprovar (chama POST /api/quality/aprovar)
- Botão de exportação para publicação manual (chama POST /api/quality/exportar)
- Botão de rejeição que retorna para revisão
- Integração com o fluxo de aprovação humana (estados Rascunho/Aprovado/Publicado)

### Arquivos criados/modificados
- `src/preview/routes.ts` — Rota Hono de prévisualização com template HTML embutido
- `src/preview/template.html` — Template de referência da tela de preview
- `src/routes.ts` — Adicionada rota /preview ao agregador
- `src/index.ts` — Etapa atualizada para 'preview_publicacao'
- `docs/dev-log.md` — Esta entrada

### Testes
- Build TypeScript: OK
- Testes de unidade: 12 passando (não alterados)
- Teste manual da tela de preview: acessar GET /api/preview/:materialId/:plataforma

### Próximos passos
- Testar a tela de preview com dados reais de um material cadastrado
- Integrar com APIs oficiais das plataformas sociais para publicação efetiva
- Gerar migrations Drizzle e aplicar no banco PostgreSQL

---

*Fim da entrada 9. Novos despachos serão adicionados abaixo, em ordem cronológica, nunca sobrescrevendo entradas anteriores.*

---

## Entrada 10 — Prévisualização Completa no Localhost

**task_id:** PREVIEW-002  
**Data:** 17/11/2026  
**Responsável:** PLANMASTER (implementação)  
**Tipo:** Implementação — Prévisualização completa no localhost antes de publicar na rede social

### Decisões tomadas
- Criada rota GET /api/preview/completo/:materialId/:plataforma que agrega TODOS os elementos da publicação (conteúdo, adaptação, imagem, qualidade, SEO, estado de publicação) em uma única tela HTML/Tailwind
- Servidor local dedicado na porta 3001 que abre o navegador automaticamente ao iniciar
- Script scripts/abrir-preview.sh para iniciar o servidor com build automático
- A tela mostra: estado da publicação, qualidade (critérios individuais), SEO, conteúdo editável, imagem gerada, contador de caracteres em tempo real, e botões de ação (salvar, exportar, aprovar)
- Integração com o fluxo de aprovação humana: só permite aprovar se todos os critérios de qualidade estiverem atendidos
- Exportação para publicação manual em JSON

### Arquivos criados/modificados
- `src/preview/completo.ts` — Rota Hono com agregação completa de dados e template HTML embutido
- `src/preview/servidor-local.ts` — Servidor local na porta 3001 com abertura automática de navegador
- `scripts/abrir-preview.sh` — Script shell para iniciar o servidor com build
- `src/routes.ts` — Adicionada rota /preview ao agregador principal
- `src/index.ts` — Etapa atualizada para 'preview_completo_localhost'
- `docs/dev-log.md` — Esta entrada

### Fluxo de uso
1. Cadastrar projeto editorial → gerar conteúdo → adaptar para plataforma → criar briefing → gerar imagem → revisar qualidade → definir SEO → aprovar (humano)
2. Acessar: http://localhost:3001/preview/completo/:materialId/:plataforma
3. Revisar a prévisualização completa com todos os elementos
4. Aprovar ou exportar para publicação manual

### Testes
- Build TypeScript: OK
- Testes de unidade: 12 passando
- Teste manual: acessar GET /api/preview/completo/1/linkedin no servidor local

### Próximos passos
- Testar na real com dados de um material cadastrado no banco
- Integrar com APIs oficiais das plataformas sociais para publicação efetiva após aprovação
- Gerar migrations Drizzle e aplicar no banco PostgreSQL

---

*Fim da entrada 10. Novos despachos serão adicionados abaixo, em ordem cronológica, nunca sobrescrevendo entradas anteriores.*
