# ADR-001 — Uso exclusivo de modelos gratuitos; proibição de API paga da OpenAI

## Status
Aceito

## Contexto
O projeto Social Content Hub exige utilização prioritária de modelos gratuitos disponíveis diretamente no catálogo de provedores compatíveis com o OpenCode. Não se deve pressupor disponibilidade de modelos pagos da OpenAI, nem utilizar a API paga da OpenAI como dependência. A arquitetura deve permitir que cada agente utilize um modelo apropriado à sua responsabilidade e não fixar modelos permanentemente sem prever substituição.

## Decisão
- Adotar o OpenRouter como roteador de modelos gratuitos, com variantes `:free` (preço US$ 0/M entrada e saída).
- Cada agente utiliza um modelo específico conforme a matriz do SRS (seção 5):
  - Content Orchestrator: Nemotron 3 Ultra (raciocínio/orquestração, contexto 1M).
  - Researcher / Art Director: Nemotron 3.5 Super VL (visão + pesquisa, contexto 1M).
  - Writer / SEO Specialist: Gemma 4 31B (redação PT-BR, multilíngue).
  - Platform Adapter: Nemotron 3.5 Lightning (adaptação leve, alto throughput).
  - Quality Reviewer: Nemotron 3 Ultra.
- Roteador com fallback (`openrouter/free`) para permitir substituição de modelo sem retrabalho.
- Proibição expressa de dependência de API paga da OpenAI (GPT-4o e similares).

## Alternativas consideradas
- Modelos pagos da OpenAI: rejeitados (violam restrição obrigatória do projeto).
- Ollama local com modelos open-weight: alternativa viável para execução local, mas adiciona requisito de hardware; mantida como alternativa futura, não como dependência obrigatória.

## Consequências
- Positivo: custo quase nulo para modelos de linguagem; substituição de modelo sem retrabalho; conformidade com a restrição de modelos gratuitos.
- Negativo: limite de taxa dos modelos `:free` (20 RPM / 50 RPD no plano gratuito); necessidade de cache semântico e router por capacidade.
- Riscos: modelos gratuitos podem deixar de estar disponíveis; mitigado pelo router com fallback e revisão periódica da coleção OpenRouter.

## Relacionado
- SRS: RNF-006, RNF-008, RN-006, RF-018.
- Benchmarks: docs/social-content-hub/02-benchmarks.md (seção 2).
