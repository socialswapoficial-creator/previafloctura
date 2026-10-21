# Performance — Paraíso das Flores

Otimização aplicada em 21/10/2026. Site institucional em HTML, CSS e JavaScript puro, hospedado no Sites; atende desktop e mobile. Recursos principais: sequência canvas na abertura, quatro vídeos, carrossel, animações e Google Maps. Objetivo: apresentar a casa e encaminhar para cardápio/WhatsApp.

## Prioridades e impacto

| Prioridade | Problema encontrado | Alteração aplicada | Impacto esperado |
|---|---|---|---|
| Crítica | A abertura buscava todos os grupos da sequência sem depender da rolagem | Busca progressiva dos grupos próximos ao quadro atual, somente após o poster; concorrência limitada | Menor concorrência com a primeira tela e menos dados sem interação |
| Alta | Mobile mantinha todos os grupos decodificados em memória | Cache limitado à vizinhança, com limite ainda menor em aparelhos que informam pouca memória | Menor pressão de memória e risco de travamentos |
| Alta | Trabalho de rolagem repetido por evento | Leitura e atualização agrupadas em requestAnimationFrame | Menos trabalho na thread principal, benefício esperado para fluidez/INP |
| Alta | Split text construía cópias e recortes de todo o site no início | Preparação apenas ao entrar na viewport e restauração dos nós originais no fim | Menor DOM e custo de inicialização; preserva animações |
| Alta | Vídeos de ambiente e flores grandes | Recodificação H.264, mesma resolução/duração, sem áudio e com faststart | Menos transferência e início progressivo |
| Média | Google Maps podia iniciar antes do usuário chegar ao rodapé | IntersectionObserver carrega perto do rodapé, mantendo dimensões e link externo | Evita recursos externos no carregamento inicial |
| Média | Seis scripts separados e sem nomes por conteúdo | Um bundle defer e CSS com hash; rotina de geração sem dependências | Menos requisições e atualização segura de cache |
| Média | Foto JPEG do rodapé | WebP na mesma resolução | Redução de 27,3% no arquivo |
| Baixa | Sequências antigas sem uso na implementação atual | Removidas duas pastas de versões antigas do pacote | Pacote de publicação menor; não é ganho direto de rede para o visitante |

## Resultados mensurados

Tamanhos em bytes, comparados localmente:

| Arquivo | Antes | Depois | Redução |
|---|---:|---:|---:|
| Vídeo do ambiente | 14.537.171 | 11.822.993 | 18,7% |
| Vídeo das flores | 12.050.357 | 9.700.885 | 19,5% |
| Foto do rodapé | 1.007.236 | 732.162 | 27,3% |

Economia somada nesses três recursos: 5.338.724 bytes, aproximadamente 5,1 MiB, quando todos forem acessados. Não representa economia integral da primeira tela, porque são carregados conforme a navegação.

Comparação SSIM dos vídeos: ambiente 0,991355 e flores 0,988505. É uma medida técnica de similaridade, não uma garantia de percepção visual idêntica. Resoluções e durações preservadas; versões originais mantidas no histórico do projeto. Café e pizza já eram menores e foram preservados.

Na verificação de desktop, no topo da página: dois grupos da abertura carregados, nenhum vídeo interno com src, mapa sem src e 312 elementos no DOM após o término da animação. Nenhum recorte de palavras permaneceu no DOM nesse estado. Esse resultado é uma observação do teste, não um limite de memória do navegador.

## Core Web Vitals

- LCP: poster responsivo e prioritário preservado; sequência deixa de competir com ele antes de carregar. Não foi medido um LCP padronizado antes/depois.
- INP: menos DOM inicial, scroll agrupado por frame, decodificação limitada e mapa adiado. Benefício esperado; INP exige tráfego/interações reais para confirmação.
- CLS: dimensões, proporções e estrutura de vídeos e mapa preservadas; nenhum carregamento depende de inserir um bloco sem espaço reservado. Não foi medido um CLS padronizado.
- Não foram executados Lighthouse/PageSpeed ou coleta de campo CrUX/RUM. Nenhuma nota ou percentual de melhora dessas métricas foi inventado.

## Imagens e fontes

- Rodapé convertido para WebP sem reduzir a resolução.
- Imagens pequenas e ilustrações existentes preservadas; a maior parte já usa WebP/SVG.
- Poster de abertura usa picture para mobile/desktop; preload restrito à mídia correspondente e fetchpriority alto.
- Imagens secundárias mantêm lazy loading e dimensões explícitas onde aplicável.
- Georgia/Arial e outras alternativas do sistema: nenhuma fonte externa, download de família/peso ou font-preload necessário.
- Mais variantes responsivas de imagens só devem ser introduzidas com evidência de economia; as sequências já têm versões específicas por dispositivo.

## CSS, JavaScript e dependências

- Um CSS versionado, sem comentários no arquivo gerado. Fontes legíveis permanecem para manutenção.
- Regras antigas não foram removidas por heurística cega: pseudoestados, media queries e classes dinâmicas poderiam ser afetados. Limpeza profunda de CSS restante é prioridade baixa e requer cobertura de todos os estados.
- Um bundle defer, sem bibliotecas adicionadas. Não há React, framework ou pacote pesado a remover.
- Animações por transform/opacity preservadas; máscaras de vídeo continuam temporárias e terminam sem recorte.
- Split text prepara somente blocos visíveis e remove estruturas temporárias após concluir; seleção ativa é respeitada.
- Movimento reduzido mantém conteúdo visível; economia de dados evita baixar a sequência animada da abertura.
- Reprodução de vídeos continua condicionada à visibilidade e pausa com a página em segundo plano.

## Cache, compressão e servidor

Antes da publicação foi confirmado na produção: HTTP/2, Gzip e cf-cache-status HIT para CSS. Não foi necessário ativar um compressor na aplicação.

Foi adicionado dist/_headers: cache anual immutable somente para /assets/static/*, cujos nomes têm hash de conteúdo, e revalidação do HTML. A aplicação efetiva desses cabeçalhos depende da hospedagem; verificar o resultado publicado. Assets com nomes reutilizáveis não recebem immutable para evitar versões antigas após ajustes.

Scripts/package-static.py gera o bundle e CSS com hash antes de publicar; AGENTS.md documenta o procedimento. CSS com hash usa caminhos absolutos para os assets, preservando texturas e imagens.

HTTP/3, Brotli, localização de origem, TTFB e configuração interna da CDN dependem da plataforma. Não foram alterados nem tratados como melhorias comprovadas. TTFB precisa de medições repetidas em regiões/conexões representativas.

## Mobile e rede lenta

- Teste em iframe de 390 px, com área útil de 375 px: sem overflow horizontal; aba Mais flores funcionando.
- Decodificação limitada com adaptação quando deviceMemory está disponível; fallback conservador nos demais navegadores.
- saveData, quando informado pelo navegador, mantém o poster da abertura e evita sua sequência pesada.
- Sem vídeos internos nem mapa na primeira tela do teste de desktop.
- Ainda é necessário testar um aparelho Android de entrada e rede móvel real. Em conexão muito lenta, os vídeos podem continuar levando tempo para carregar; miniaturas permanecem como apresentação inicial.

## Checklist final

- [x] Preservar site público, identidade visual e animações relevantes.
- [x] Validar sintaxe dos scripts e bundle.
- [x] Verificar referências locais de HTML/CSS e caminhos de assets.
- [x] Validar navegação para a seção de ambiente e abas em desktop/mobile.
- [x] Confirmar mapa adiado e carregamento ao chegar ao rodapé.
- [x] Confirmar fundo do rodapé, texturas e ausência de overflow horizontal.
- [x] Comparar tamanho, resolução, duração e similaridade dos vídeos alterados.
- [x] Não adicionar dependências.
- [ ] Confirmar cabeçalhos finais de cache após publicar.
- [ ] Medir LCP/INP/CLS com ferramentas e tráfego representativos.
- [ ] Testar aparelhos físicos de entrada, CPU limitada e rede lenta.

A ordem recomendada para próximos passos é: auditoria mobile em produção; acompanhamento de Core Web Vitals; ajustes adicionais na sequência caso o hardware real ainda apresente travamentos; limpeza detalhada de CSS com cobertura visual de todos os estados.
