# OperumData — landing page institucional

Versão 2 visual, em português, da landing page B2B da OperumData.

## Direção

- Data-Driven Brutalism / Terminal / DevTool com linguagem industrial
- base preto profundo, off-white e signal orange `#FF5A1F`
- tipografia local de display e mono técnica, sem dependência de fontes externas
- narrativa de uma única página
- pipeline operacional animado como elemento principal do Hero
- animações funcionais na rede, método, controle e fluxo de hardware
- sem métricas, clientes, certificações ou capacidades não validadas
- sem imagens genéricas
- responsiva para desktop e celular
- animações CSS com suporte a `prefers-reduced-motion`

## Estrutura principal

```text
app/
  layout.tsx       metadados, idioma e favicon
  page.tsx         conteúdo e componentes da landing page
  globals.css      sistema visual, layouts e responsividade
components/ui/
  accordion.tsx    FAQ acessível
  button.tsx       CTAs
public/
  favicon.svg      ícone da OperumData
  fonts/           fontes locais usadas pela V2
```

## Executar localmente

Requisitos: Node.js 22.13 ou superior e pnpm.

```bash
pnpm install
pnpm dev
```

## Validar o build

```bash
pnpm build
```

## Pendente antes da publicação

O destino externo dos botões “Discutir um projeto” deve ser conectado após a definição do e-mail, formulário ou agenda comercial. Nenhum domínio ou publicação foi configurado nesta versão.
