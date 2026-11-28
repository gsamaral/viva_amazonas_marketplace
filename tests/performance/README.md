# Testes de performance com k6

Os cenários k6 exercitam os endpoints de consulta da API, sem criar ou alterar
reservas. Cada execução verifica respostas e aplica limites de desempenho.

## Pré-requisitos

- k6 instalado e disponível no `PATH`.
- API iniciada com `npm run dev:api` e acessível em `http://localhost:4000`.
- Para apontar para outro endereço, definir `BASE_URL`.

## Cenários

### Carga sustentada do catálogo

Executa `GET /api/tours` com até 10 usuários virtuais, mantendo a carga por 40
segundos. Critérios: menos de 1% de falhas, 99% das verificações aprovadas e
percentil 95 do tempo de resposta abaixo de 1 segundo.

```bash
npm run test:performance:catalog
```

### Estresse do filtro por cidade

Alterna entre Manaus e Presidente Figueiredo, aumentando gradualmente a carga
até 50 usuários virtuais. Além da disponibilidade, valida que todos os passeios
retornados correspondem à cidade solicitada. Critérios: menos de 1% de falhas,
99% das verificações aprovadas e percentil 95 abaixo de 2 segundos.

```bash
npm run test:performance:stress
```

Para executar contra outra instância:

```powershell
$env:BASE_URL = "http://localhost:4000"
npm run test:performance:catalog
npm run test:performance:stress
```

Os limites são metas iniciais para ambiente local, não uma certificação de
capacidade de produção. Registre versão, máquina, configuração, duração e resumo
do k6 em [planejamento e execução](../../docs/testes/planejamento-execucao/README.md).

