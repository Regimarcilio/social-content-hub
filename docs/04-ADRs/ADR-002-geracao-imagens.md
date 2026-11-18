# ADR-002 — Geração de imagens: ComfyUI local + FLUX (Apache 2.0); hospedado como fallback

## Status
Aceito

## Contexto
A qualidade visual é requisito prioritário. O sistema deve produzir imagens de padrão premium relacionadas ao conteúdo das publicações. Não se deve presumir que modelos textuais gratuitos do OpenCode geram imagens. A geração visual deve ser separada dos agentes de redação e trabalhar em duas etapas: (1) desenvolvimento e avaliação de conceitos visuais; (2) geração e finalização da imagem definitiva. Deve-se evitar consumo desnecessário de recursos com múltiplas gerações sem critérios.

## Decisão
- Ferramenta de execução local: ComfyUI (GPL-3.0, interface baseada em nós, ativo semanalmente, suporte a SDXL/SD 3.5/FLUX/Qwen-Image/Wan).
- Modelo principal (uso comercial livre): FLUX.1 [schnell] (Black Forest Labs, licença Apache 2.0), rápido, 1–4 passos, VRAM indicada ~8 GB.
- Alternativa leve (uso comercial livre): FLUX.2 [klein] 4B (Apache 2.0), ~13 GB VRAM, texto para imagem + edição, várias imagens de referência.
- Fallback hospedado com cota gratuita: Leonardo AI (150 tokens/dia, direitos comerciais) ou Adobe Firefly (gerações diárias limitadas, seguro para uso comercial dos modelos Firefly).
- Proibido: FLUX.1 [dev] / FLUX.2 [dev] para uso comercial sem licença paga da Black Forest Labs (licença não comercial).
- Duas etapas obrigatórias: conceito (avaliação) → definitiva; não gerar múltiplas imagens sem critério de avaliação.
- Etapa de finalização gráfica (tipografia, alinhamento, legibilidade, qualidade).

## Alternativas consideradas
- Stable Diffusion 3.5 Medium/Large: alternativa válida (ecossistema maduro, LoRA/ControlNet), mas licença Community restringe uso comercial a receita < US$ 1M/ano; mantida como alternativa.
- Serviços externos com cota gratuita (Gemini Nano Banana, ChatGPT GPT Image, Ideogram, Canva): usados apenas como fallback, não como dependência principal. ChatGPT/GPT Image não é dependência (proibição de API paga da OpenAI).

## Consequências
- Positivo: uso comercial livre (Apache 2.0), sem cota por imagem na execução local, controle total de direção de arte via workflow de nós, custo marginal = eletricidade.
- Negativo: requer GPU compatível (NVIDIA 8–24 GB ou Apple Silicon); complexidade de setup; VRAM é o fator limitante.
- Riscos: GPU insuficiente; mitigado pelo fallback hospedado e documentação de requisitos de VRAM.

## Relacionado
- SRS: RF-010, RF-011, RN-004.
- Benchmarks: docs/social-content-hub/02-benchmarks.md (seção 3).
