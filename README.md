# VIGIL — Demonstração interactiva

> **Plataforma de Acompanhamento do Direito da União Europeia**
> DAPL · Secretaria-Geral do Governo · Abril 2026

Demonstração navegável da plataforma VIGIL, simulando todos os módulos com dados realistas. Funciona sem servidor, em qualquer browser moderno.

## ▶︎ [Abrir a demo](https://dapl-sggov.github.io/vigil-demo/)

(funcional após activação do GitHub Pages — ver instruções abaixo)

---

## Perfis de demonstração

Clica num para entrar:

| Credenciais | Perfil | Acesso |
|-------------|--------|--------|
| `bvidal` / `bvidal` | **Admin DAPL** (Bernardo Vidal) | Acesso pleno · administração da plataforma |
| `dgdei` / `dgdei` | **DGDEI** | Acesso total · CONTENCIOSO incluído |
| `admin` / `admin` | **SGGov · Coordenação** | Tudo excepto CONTENCIOSO restrito |
| `tecnico` / `tecnico` | **Técnico/Jurista** | Sem CONTENCIOSO · sem ADMIN |
| `gabinete` / `gabinete` | **Gabinete ministerial** | Vista executiva (RADAR · GABINETES · ALERTAS) |

## Módulos disponíveis

- **PROSPETIVA** — análise de impacto IA simulada · 6 directivas com dados reais (Lobby, AI Act, Data Act, Trabalho em Plataformas, AML6, EPBD)
- **RADAR** — monitorização de 30 processos com timeline de eventos
- **FICHA** — wizard de transposição em 5 passos com 19 campos oficiais DGDEI
- **CONTENCIOSO** — pipeline TJUE com 5 casos · acesso restrito
- **GABINETES** — vista executiva semáforo dos 16 ministérios do XXV Governo
- **ALERTAS** — central de notificações com escalonamento em 5 níveis
- **ADMIN** — orgânica · Áreas Governativas · prompts IA · utilizadores

## Sugestão de percurso (15 minutos)

1. Entra com `bvidal` / `bvidal` (vê tudo)
2. Abre **PROSPETIVA** → clica no caso **«Lobbying / Países Terceiros»** → **«Analisar com IA»** (vê os 8 stages animados, depois o plano completo)
3. Volta ao Hub → abre **RADAR** → clica num processo → drawer lateral
4. Volta ao Hub → abre **CONTENCIOSO** → drill-down num caso TJUE
5. Termina sessão → reentra como `gabinete` / `gabinete` (vê o que muda na vista para um Gabinete ministerial)

## Caveats

- **As análises PROSPETIVA são simuladas** (não chamam a Anthropic API). O articulado e o plano são representativos da experiência real, com mapeamento artigo-a-artigo a diplomas portugueses concretos.
- **localStorage** guarda sessão e preferências por browser/máquina.
- **Google Fonts CDN** carrega a tipografia Lexend e JetBrains Mono — se a rede bloquear, fontes substituem por Arial/Consolas.
- O articulado das directivas é representativo — para uso institucional formal, referir sempre [EUR-Lex](https://eur-lex.europa.eu).

## Distribuição

- **Não classificado** · uso interno SGGov · não distribuir externamente sem autorização
- Esta demonstração é apenas isso — uma demonstração. Não substitui especificação técnica formal nem documentação contratual.

## Comentários

Bernardo Vidal · Chefe da DAPL
[bernardo.vidal@sggoverno.gov.pt](mailto:bernardo.vidal@sggoverno.gov.pt)

---

## Para administradores · activar GitHub Pages

Após primeiro push:

1. **Settings → Pages** (menu lateral do repo)
2. **Source:** «Deploy from a branch»
3. **Branch:** `main` / `(root)` → **Save**
4. Aguardar 1-2 minutos · URL fica disponível no topo da mesma página
