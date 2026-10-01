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

## Por que não há loop infinito

O workflow só é disparado por eventos no repositório **JARVIS**
(`push` na `master`, `pull_request`, `workflow_dispatch`). A publicação
escreve no repositório **portfolio**, cujos pushes disparam apenas o deploy
da Vercel — nada no portfolio dispara o workflow do JARVIS de volta.
Além disso, o workflow compara o JSON gerado com o anterior e só commita
quando algo mudou, então execuções sem mudança não geram push algum.

## Como testar manualmente

1. Na aba **Actions** do repo JARVIS, selecione
   "Publish JARVIS test count" → **Run workflow** (workflow_dispatch).
   Em PRs o workflow valida sem publicar; em `push`/`workflow_dispatch`
   ele publica.
2. Localmente, a coleta pode ser conferida com:
   `python -m pytest --collect-only -q` (o número na linha
   `N tests collected` é o que vira `testCount`).

## Incidente 2026-10-01 — workflow removido da master

Em 01/10/2026 foi detectado que `.github/workflows/publish-test-count.yml`
não existia mais na branch `master` do repo JARVIS (removido por um
force-push da evolução visual). Sem o arquivo, nenhum push futuro dispara
a atualização do contador.

**Restauração** (requer credencial com escopo `workflow`):

Opção A — interface web (mais simples):
1. Em `github.com/LucaswBohrer/jarvis`, clique em **Add file → Create new file**.
2. Nome: `.github/workflows/publish-test-count.yml`.
3. Cole o conteúdo de referência (disponível no histórico do repo, commit
   `a3cb7b3`, ou no arquivo `publish-test-count.yml` entregue junto a esta doc).
4. **Commit directly to the `master` branch**.

Opção B — terminal (da sua máquina):
```bash
cd ~/jarvis && git checkout master && git pull
mkdir -p .github/workflows
# (copiar o conteúdo para .github/workflows/publish-test-count.yml)
git add .github/workflows/publish-test-count.yml
git commit -m "ci(jarvis): restore test-count publisher workflow"
git push origin master
```

Após restaurar, valide com **Run workflow** (workflow_dispatch) e confirme
que a execução aparece em Actions. O próximo `push` na master então volta
a atualizar o contador automaticamente.

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

---

# Automação — vigilância de novos repositórios (repo-watch)

## O que é

Workflow `.github/workflows/repo-watch.yml` que roda toda **segunda-feira às 09:00 BRT**
(cron `0 12 * * 1` UTC) e também manualmente via `workflow_dispatch`.

## O que faz

1. Lista os repositórios públicos de `LucaswBohrer` via GitHub API.
2. Extrai os repos já curados de `lib/projects.ts` (padrão `repo: "LucaswBohrer/<nome>"`).
3. Ignora permanentemente: `LucaswBohrer` (repo do perfil README), `portfolio`
   (o próprio site), `Eletronica-Digital` (decisão do Lucas, 2026-10-01),
   forks, arquivados e repos vazios.
4. Se houver repos novos, cria ou atualiza uma issue com label `repo-watch`
   contendo os metadados reais da API (nome, URL, descrição, linguagem,
   datas de criação/push) — nunca inventa título, descrição ou highlights.
5. Se não houver mais nada pendente, fecha a issue automaticamente.

## Por que curadoria manual

Título, descrição PT/EN, highlights e categoria são conteúdo editorial do
portfólio. O workflow detecta e notifica; a entrada em `lib/projects.ts`
é escrita por humano (ou pelo Muse a pedido do Lucas).

## Categorias de filtro disponíveis

`ai` · `automation` · `web` · `embedded` · `systems`
