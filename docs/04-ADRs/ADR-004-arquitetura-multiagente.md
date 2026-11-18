# ADR-004 — Arquitetura multiagente com orquestrador central; agentes agrupados sem redundância

## Status
Aceito

## Contexto
O projeto avalia uma arquitetura multiagente com orquestrador central e especialistas: Content Orchestrator, Researcher, Strategist, Writer, Platform Adapter, Art Director, Image Creator, Quality Reviewer, SEO Specialist. Deve-se avaliar se todos devem ser agentes independentes ou se algumas responsabilidades podem ser agrupadas, evitando agentes redundantes e consumo desnecessário de contexto.

## Decisão
- Orquestrador central: Content Orchestrator (coordena fluxo, distribui tarefas, valida entregas).
- Agentes independentes mantidos (responsabilidades distintas, entradas/saídas/dependências/critérios de aprovação definidos no SRS):
  - Researcher, Strategist, Writer, Platform Adapter, Art Director, Image Creator, Quality Reviewer, SEO Specialist.
- Não há agrupamento que gere redundância neste escopo: cada agente tem responsabilidade única e critério de aprovação próprio.
- Image Creator é separado dos agentes de redação (geração visual fora do fluxo de texto), conforme requisito.
- Cada agente utiliza um modelo apropriado à sua responsabilidade (matriz no SRS seção 5).
- Router de modelos com fallback para evitar dependência de um único modelo.

## Alternativas consideradas
- Agente único "faça-tudo": rejeitado (baixa qualidade, difícil revisão, consumo de contexto descontrolado).
- Agente separado para cada plataforma: rejeitado (redundante; o Platform Adapter já lida com múltiplas plataformas via regras próprias).

## Consequências
- Positivo: responsabilidades claras, revisão por agente dedicado (Quality Reviewer), facilidade de substituição de modelo por agente.
- Negativo: maior número de chamadas a modelos; mitigado por cache semântico, agrupamento e router por capacidade (RF-018).

## Relacionado
- SRS: RF-005 a RF-013, RNF-008.
- Arquitetura: docs/social-content-hub/03-arquitetura-e-uml.md (seção 1).
