# Rotina de Prototipação de Telas — Social Content Hub

> **Projeto:** Social Content Hub  
> **Integrado a:** OpenCode  
> **Etapa:** FASE 5 — Rotina de prototipação (planejamento, sem implementação)  
> **Versão:** 0.1  
> **Data:** 17/11/2026  
> **Branch:** `DOC`  
> **Dono da rotina:** `@protomaster`

---

## 1. Princípio Obrigatório

**Toda tela nasce protótipo.** Nenhum plano de implementação entrega front-end ou estilo sem a rotina de prototipação completa. Sem protótipo **APROVADA**, front-end e estilo são recusados.

Ciclo de vida de cada tela:

```
PROPOSTA → NAVEGÁVEL → VALIDADA → APROVADA → IMPLEMENTADA
```

Somente o dono `@protomaster` pode avançar o status de uma tela entre esses estágios.

---

## 2. Ciclo de Vida da Tela

| Status | Significado | Critério para avançar | Quem valida |
|--------|-------------|----------------------|-------------|
| PROPOSTA | Ideia da tela descrita (objetivo, entradas, saídas, fluxo) | Descrição completa do propósito e fluxo da tela | `@protomaster` |
| NAVEGÁVEL | Protótipo navegável (HTML/Tailwind ou wireframe clicável) que simula a interação | Protótipo navegável acessível e percorrível | `@protomaster` + stakeholder |
| VALIDADA | Protótipo validado com usuário real ou revisão de usabilidade | Feedback de usabilidade incorporado; acessibilidade WCAG 2.1 AA verificada | `@protomaster` + Analista de Qualidade |
| APROVADA | Protótipo aprovado como especificação final de interface | Aprovação formal do stakeholder e do `@protomaster` | `@protomaster` + Gestor de Conteúdo |
| IMPLEMENTADA | Tela codificada e integrada ao sistema | Implementação confere com o protótipo APROVADA; testes passando | Desenvolvedor + QA |

**Regra dura:** nenhuma tela sai de `APROVADA` para `IMPLEMENTADA` sem que o protótipo esteja formalmente aprovado. Telas em `PROPOSTA`, `NAVEGÁVEL` ou `VALIDADA` não recebem código de front-end.

---

## 3. Ritual por Rodada (`DEV-proto-<slug>`)

Cada ciclo de prototipação de uma tela é registrado como uma rodada com identificador `DEV-proto-<slug>`, onde `<slug>` é o identificador curto da tela (ex. `DEV-proto-cadastro-projeto`, `DEV-proto-revisao-material`).

### 3.1 Etapas do ritual

1. **Abertura da rodada:** criar entrada `DEV-proto-<slug>` no `docs/dev-log.md` com objetivo da tela, ator, entradas e saídas.
2. **PROPOSTA:** `@protomaster` escreve a proposta da tela (objetivo, fluxo, campos, regras de negócio).
3. **NAVEGÁVEL:** `@protomaster` produz o protótipo navegável (HTML/Tailwind ou wireframe clicável).
4. **Validação:** revisão de usabilidade e acessibilidade (WCAG 2.1 AA).
5. **APROVADA:** aprovação formal do stakeholder e do `@protomaster`.
6. **Handoff:** o protótipo APROVADA é entregue ao desenvolvedor como especificação de interface.
7. **Encerramento da rodada:** registrar no `docs/dev-log.md` o status final, arquivos do protótipo e decisões tomadas.

### 3.2 Entrada obrigatória no DevLog

Cada rodada `DEV-proto-<slug>` deve gerar uma entrada no `docs/dev-log.md` contendo:
- `task_id`: `DEV-proto-<slug>`
- Tela e slug
- Status alcançado (PROPOSTA / NAVEGÁVEL / VALIDADA / APROVADA / IMPLEMENTADA)
- Arquivos do protótipo (caminhos)
- Decisões de interface tomadas
- Data e responsável (`@protomaster`)

---

## 4. Mapa de Telas × Sprint (Aprovação × Implementação)

| Tela | Slug | Sprint Aprovação (protótipo APROVADA) | Sprint Implementação | Status Atual |
|------|------|---------------------------------------|----------------------|--------------|
| Cadastro de projeto editorial | `cadastro-projeto` | Sprint 1 | Sprint 1 | PROPOSTA |
| Configuração de identidade editorial | `identidade-editorial` | Sprint 1 | Sprint 1 | PROPOSTA |
| Ativação/desativação de plataformas | `toggle-plataformas` | Sprint 1 | Sprint 1 | PROPOSTA |
| Entrada de assunto e seleção de plataformas | `entrada-assunto` | Sprint 2 | Sprint 2 | PROPOSTA |
| Revisão e aprovação de material | `revisao-material` | Sprint 4 | Sprint 4 | PROPOSTA |
| Exportação para publicação manual | `exportacao-manual` | Sprint 4 | Sprint 4 | PROPOSTA |
| Histórico e versões do projeto | `historico-projeto` | Sprint 5 | Sprint 5 | PROPOSTA |
| Indicadores de custo | `indicadores-custo` | Sprint 5 | Sprint 5 | PROPOSTA |

> O status será atualizado à medida que as rodadas `DEV-proto-<slug>` forem concluídas. Nenhuma tela implementada antes de seu protótipo estar em `APROVADA`.

---

## 5. Regras Duras

1. **Sem protótipo APROVADA, não há front-end.** Qualquer tentativa de implementar tela sem protótipo APROVADA é recusada no code review.
2. **Sem protótipo APROVADA, não há estilo (CSS/Tailwind).** Estilos só são escritos com base no protótipo aprovado.
3. **Dono exclusivo:** apenas `@protomaster` avança o status de uma tela no ciclo de vida.
4. **DoR condicionada:** toda User Story que envolva tela tem como Definition of Ready (DoR) obrigatório o protótipo da tela em status `APROVADA`.
5. **Não pular estágios:** uma tela não salta de `PROPOSTA` para `APROVADA` sem passar por `NAVEGÁVEL` e `VALIDADA`.
6. **Registro obrigatório:** toda rodada `DEV-proto-<slug>` deve ter entrada no `docs/dev-log.md`.

---

## 6. Definition of Ready (DoR) para User Stories com Tela

Uma User Story que envolva interface só está pronta para desenvolvimento (DoR satisfeita) quando:

- [ ] Protótipo da tela em status `APROVADA` (dono `@protomaster`)
- [ ] Entrada `DEV-proto-<slug>` registrada no `docs/dev-log.md`
- [ ] Critérios de aceite em Gherkin definidos
- [ ] RF associado validado no SRS
- [ ] Dependências de API/MCP mapeadas

---

## 7. Handoff para Implementação

Quando o protótipo atinge `APROVADA`, o handoff ao desenvolvedor inclui:

- Arquivos do protótipo (HTML/Tailwind ou wireframe) com caminhos documentados no dev-log.
- Especificação de interação (fluxo, campos, validações, mensagens de erro).
- Regras de identidade editorial aplicáveis (paleta de cores, tom de voz, estilo de imagens).
- Critérios de aceitação da interface (do SRS e do Gherkin da US).

O desenvolvedor implementa conferindo com o protótipo APROVADA e reporta qualquer divergência ao `@protomaster` antes de considerar a tela `IMPLEMENTADA`.

---

*Próxima etapa: FASE 6 — Plano de entrega + dev-log.*
