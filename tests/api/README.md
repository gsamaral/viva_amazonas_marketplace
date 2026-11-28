# Testes automatizados da API

Os testes de API usam Vitest e Supertest em um banco MongoDB isolado na memória.
Eles cobrem saúde da aplicação, autenticação, consulta de passeios e reservas.

## Executar

Na raiz do projeto:

```bash
npm run test:api
```

## Casos cobertos

- Status operacional da API.
- Login válido e inválido.
- Validação e cadastro de usuários.
- Listagem e filtro de passeios.
- Passeio não encontrado.
- Proteção de endpoints autenticados.
- Validação de carrinho vazio.
- Checkout confirmado com decremento das vagas.

## Pré-requisitos

- Node.js 20 ou superior.
- Dependências instaladas com `npm install`.
- Conexão inicial disponível para o MongoDB em memória, caso o binário ainda não esteja instalado.

Consulte a especificação em [OpenAPI](../../docs/openapi.yaml).

