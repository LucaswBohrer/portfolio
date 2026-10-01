# Automação — contador de testes do JARVIS

## O que é

O case JARVIS no portfólio exibe o número de testes automatizados **sem nenhum
valor fixo no código**. O número vem de `public/data/jarvis-tests.json`, que é
gerado e atualizado automaticamente pelo CI do repositório JARVIS.

## Origem do dado

Workflow: `LucaswBohrer/jarvis` → `.github/workflows/publish-test-count.yml`

- Dispara em: `push` na `master`, `pull_request` (só validação) e
  `workflow_dispatch` (manual).
- Instala Python 3.12 + dependências de desenvolvimento do `pyproject.toml`.
- Executa a coleta real: `python -m pytest --collect-only -q` e extrai o total
  da linha `N tests collected`.
- Executa a suíte completa (`python -m pytest -q`) no push da master.
- Só publica se a coleta **e** a suíte completa passarem. Uma suíte que falha
  nunca sobrescreve o último valor válido.
- Gera `public/data/jarvis-tests.json` no repo do portfólio:

```json
{
  "project": "JARVIS",
  "testCount": 377,
  "source": "pytest --collect-only -q",
  "status": "passed",
  "verifiedAt": "2026-10-01T13:42:53Z",
  "commit": "0a7540cabcd7ba0e8701b8cac5e5595b06523676",
  "workflowRun": "https://github.com/LucaswBohrer/jarvis/actions/runs/0000000000"
}
```

- Compara com o JSON anterior e só commita quando algo mudou
  (`chore(data): sync JARVIS test count`).
- O push no portfólio dispara o deploy automático na Vercel.

## Definição do contador

`testCount` = **casos coletados pelo pytest** (`pytest --collect-only -q`).
Testes parametrizados contam como casos coletados individuais. Não é contagem
de arquivos, módulos ou funções — é a coleta real do pytest.

## Como o portfólio consome

- `lib/jarvis-tests.ts` importa o JSON no build e valida:
  `status === "passed"`, `testCount` inteiro ≥ 0, `verifiedAt` data válida.
- Se válido: exibe "**N** testes automatizados validados" + "Última validação:
  <data>" (formatada em pt-BR/en-US) + link discreto para a execução no CI.
- Se ausente ou inválido: exibe a mensagem neutra "Suíte de testes verificada
  no CI" / "Test suite verified in CI" — nunca um número inventado.
- O número tem `aria-label` explicando que vem de execução automatizada do pytest.

## Configuração necessária (uma vez)

O workflow precisa de um secret no repositório **JARVIS**
(Settings → Secrets and variables → Actions):

- Nome: `PORTFOLIO_SYNC_TOKEN`
- Valor: um Personal Access Token (fine-grained) com permissão
  **Contents: read and write** apenas no repositório `LucaswBohrer/portfolio`.

Sem esse secret, o workflow falha de forma visível no GitHub Actions com
instruções — nenhum token fica exposto no frontend, no código ou nos logs.

Observação: pushes que criam/atualizam arquivos em `.github/workflows/`
exigem o escopo `workflow` na credencial. Se o push for rejeitado com
`refusing to allow ... without 'workflow' scope`, faça o push da sua máquina
com sua credencial ou crie o arquivo pela interface web do GitHub.
