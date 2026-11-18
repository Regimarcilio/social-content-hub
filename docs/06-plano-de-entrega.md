# Plano de Entrega — Social Content Hub

> **Projeto:** Social Content Hub  
> **Integrado a:** OpenCode  
> **Etapa:** FASE 6 — Plano de entrega e handoff (planejamento, sem implementação)  
> **Versão:** 0.1  
> **Data:** 17/11/2026  
> **Branch:** `DOC`

---

## 1. Estrutura de Pastas Proposta

```
social-content-hub/
├── docs/                              # Documentação de planejamento (esta etapa)
│   ├── 01-visao-e-escopo.md
│   ├── 02-benchmarks.md
│   ├── SRS.md
│   ├── 03-arquitetura-e-uml.md
│   ├── 04-rotina-prototipacao-telas.md
│   ├── 05-backlog.md
│   ├── 06-plano-de-entrega.md
│   ├── dev-log.md                     # Diário de bordo append-only (skill devlog)
│   └── 04-ADRs/
│       ├── ADR-001-modelos-gratuitos.md
│       ├── ADR-002-geracao-imagens.md
│       ├── ADR-003-servidores-mcp.md
│       ├── ADR-004-arquitetura-multiagente.md
│       └── ADR-005-estados-publicacao.md
├── src/                               # Código-fonte (implementação futura)
│   ├── ai/                            # Gateway de IA (router, cache semântico, RAG, guardrail)
│   ├── agents/                        # Agentes especializados (Orchestrator, Researcher, ...)
│   ├── mcp/                           # Servidores MCP próprios (publicação social, etc.)
│   ├── images/                        # Orquestração de geração de imagem (ComfyUI / fallback)
│   ├── editorial/                     # Memória editorial (projetos, materiais, versões)
│   ├── platforms/                     # Adaptadores por plataforma (LinkedIn, Reddit, ...)
│   └── shared/                        # Utilitários, tipos, validações (Zod)
├── tests/                             # Testes automatizados (unitário, integração, E2E)
├── prototypes/                        # Protótipos navegáveis (dono @protomaster)
├── docker/                            # Dockerfile, docker-compose (ComfyUI, app, DB)
├── .github/                           # CI/CD, workflows
└── README.md
```

> **Nota:** `docs/dev-log.md` e `docs/conhecimento/` (se criado) devem constar na estrutura e a entrada no diário é item obrigatório do DoD (ver seção 5).

---

## 2. Comandos de Setup por Stack

A stack de implementação ainda não está definida (pendente de decisão com o usuário). Abaixo, os comandos candidatos por stack, a serem confirmados na FASE de implementação.

### 2.1 Node.js / TypeScript (padrão do repositório: Hono/Nest/Zod/Drizzle)

```bash
# Inicializar projeto
npm init -y
npm install -D typescript ts-node @types/node vitest

# Dependências de runtime (exemplo)
npm install hono zod drizzle-orm pg dotenv

# Variáveis de ambiente
cp .env.example .env   # OPENAI_API_KEY NÃO deve ser preenchida (proibido)
                       # OPENROUTER_API_KEY (modelos gratuitos)
                       # MCP_API_KEYS (pesquisa web, se aplicável)

# Executar
npm run dev
npm test
npm run lint
```

### 2.2 Python (alternativa para agentes/IA)

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt   # openai (compatível OpenRouter), pydantic, pytest
cp .env.example .env
python main.py
pytest
```

### 2.3 Docker / ComfyUI (geração de imagem local)

```bash
# Subir ComfyUI local (exemplo)
docker compose -f docker/compose.yml up -d comfyui
# Acessar: http://127.0.0.1:8188
# Baixar modelos: FLUX.1 [schnell] / FLUX.2 [klein] 4B (Apache 2.0) no Hugging Face
```

> **Restrição:** não instalar MCP, não criar agentes, não alterar configurações existentes nesta etapa de planejamento. Os comandos acima são apenas referência para o plano de entrega futuro.

---

## 3. Estratégia de Branches

| Branch | Propósito | Regras |
|--------|-----------|--------|
| `main` | Produção estável | Nunca commit direto. Apenas mergis de `release/*`. |
| `develop` | Integração contínua | Branch de trabalho padrão. PRs de `feature/*` entram aqui. |
| `feature/*` | Nova funcionalidade | Criada a partir de `develop`. Merge via PR para `develop`. |
| `release/*` | Preparação de release | Criada a partir de `develop`. Merge para `main` e `develop`. |
| `hotfix/*` | Correção urgente | Criada a partir de `main`. Merge para `main` e `develop`. |
| `DOC` | Documentação/planejamento | Usada nesta etapa. Merge para `develop` quando concluído. |

**Fluxo padrão:** `main` ← `release/*` ← `develop` ← `feature/*` / `DOC`.

**Commits:** Conventional Commits em pt-BR ou en (padronizar por projeto):
- `type(scope): descrição curta`
- types: `docs`, `plan`, `feat`, `fix`, `chore`, `refactor`, `test`
- Exemplo: `docs(plan): adiciona SRS v0.1 do Social Content Hub`

**Proibido:** `push --force`, `reset --hard`, commit direto em `main`/`master`, `add -A` sem revisar.

**Push padrão:** `git push -u origin develop` (somente com confirmação do usuário).

---

## 4. CI Mínima

- Lint + type-check em cada PR.
- Testes automatizados (unitário + integração) rodando em PR.
- `kalimaster-sast` (varredura de segredos, dependências e configs) como gate de qualidade.
- Verificação de que nenhum commit adiciona dependência de API paga da OpenAI (grep por `openai` chave paga / `gpt-4o` etc. como dependência obrigatória).
- Bloqueio de merge se testes falharem ou SAST encontrar segredos.

---

## 5. Checklist Anti-Retrabalho (Definition of Done)

Cada User Story só é considerada concluída (DoD) quando:

- [ ] Critérios de aceite (Gherkin) atendidos
- [ ] Testes automatizados passando (unitário + integração)
- [ ] `kalimaster-sast` limpo (sem segredos, dependências vulneráveis, configs inseguras)
- [ ] Se envolve tela: protótipo APROVADA (dono `@protomaster`) e entrada `DEV-proto-<slug>` no dev-log
- [ ] Entrada no `docs/dev-log.md` registrada (append-only, com `task_id`)
- [ ] Documentação atualizada (SRS, UML, ADRs, se aplicável)
- [ ] Revisão de código (code review) aprovada
- [ ] Commit em Conventional Commits na branch `develop` (ou `feature/*`)

---

## 6. DevLog (Diário de Bordo)

O arquivo `docs/dev-log.md` é o diário de bordo append-only do projeto. Cada despacho futuro (implementação, revisão, fechamento de issue) será registrado com `task_id`, decisões, arquivos afetados e testes.

A entrada inicial desta etapa de planejamento está registrada abaixo.

---

## 7. Critérios para Autorizar a Implementação

A implementação só será autorizada quando:

1. SRS validado por stakeholders.
2. Diagramas UML (casos de uso, classes, sequência) consistentes com o SRS.
3. ADRs (ADR-001 a ADR-005) aprovados.
4. Backlog Scrum com épicos, User Stories, critérios de aceite e sprints definidos.
5. Rotina de prototipação definida (regras duras e DoR condicionada a protótipo APROVADA).
6. Plano de entrega com estratégia de branches, CI mínima e checklist de DoD.
7. Benchmarks validados com testes práticos (modelos gratuitos e geração de imagem).
8. Usuário confirma autorização para iniciar a Sprint 0.

---

*Próxima etapa: registro da entrada inicial no dev-log e commit do planejamento.*
