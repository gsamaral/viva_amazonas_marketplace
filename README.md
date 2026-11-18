# Viva Amazônia — Marketplace de passeios

Aplicação demonstrativa de marketplace para descoberta e reserva de passeios turísticos em Manaus e Presidente Figueiredo. O projeto contém frontend React, API REST Express, persistência MongoDB em memória e documentação OpenAPI.

## Requisitos

- Node.js 20 ou superior
- npm
- A primeira inicialização do `mongodb-memory-server` pode baixar o binário do MongoDB. É necessário acesso à internet nessa etapa.

## Instalação e execução

```bash
npm install
cp .env.example .env
npm run dev
```

A aplicação web fica em `http://localhost:5173` e a API em `http://localhost:4000`.

Para gerar a versão de produção do frontend:

```bash
npm run build
```

A API usa `MongoMemoryReplSet` (um replica set local em memória do pacote `mongodb-memory-server`) para permitir transações atômicas no checkout. Os dados existem somente enquanto o processo da API estiver ativo e são recriados na inicialização. Não use esse armazenamento para produção.

## Usuários de demonstração

Senha de todos: `turismo123`

| Perfil | E-mail |
|---|---|
| Turista | ana@exemplo.com |
| Turista | bruno@exemplo.com |
| Agência/provedor | contato@amazonas.com |

Os usuários e passeios de demonstração são inseridos automaticamente na inicialização da API. O seed inclui quatro experiências: Encontro das Águas, Cachoeira de Iracema, Caverna do Maroaga/Gruta da Judéia e experiência ribeirinha. Há duas ofertas com preço promocional.

## Funcionalidades

1. Cadastro e login com senha criptografada (bcrypt) e token JWT.
2. Catálogo de passeios com filtro por destino, preço promocional, data e vagas.
3. Carrinho de reservas no navegador, com ajuste de participantes.
4. Checkout autenticado e confirmação de reservas.

## Regras de negócio implementadas

- Cada passeio possui quantidade limitada de vagas.
- Oferta promocional mantém `originalPrice` e `price`; o frontend exibe ambos quando o preço atual é menor.
- O checkout revalida disponibilidade no banco, não confiando na quantidade exibida no carrinho.
- A atualização das vagas e a criação das reservas ocorrem na mesma transação MongoDB.
- Cada reserva referencia um usuário e um passeio, com quantidade, preço unitário e total.
- Se qualquer item não puder ser reservado, a transação é revertida e nenhuma reserva do carrinho é confirmada.
- Quantidade por item deve ser um inteiro positivo; carrinho vazio não pode ser finalizado.

## URLs importantes

| Recurso | URL |
|---|---|
| Site | http://localhost:5173 |
| API / health check | http://localhost:4000/health |
| Documentação Swagger UI | http://localhost:4000/api-docs |
| Especificação OpenAPI YAML | http://localhost:4000/api-docs.yaml |
| Listagem de passeios | http://localhost:4000/api/tours |

## Principais endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tours?city=Manaus`
- `GET /api/tours/:id`
- `GET /api/bookings/mine` — requer `Authorization: Bearer <token>`
- `POST /api/bookings/checkout` — requer `Authorization: Bearer <token>`

## Git e Pull Request

O projeto está preparado para versionamento Git. Para iniciar o histórico local:

```bash
git init
git add .
git commit -m "feat: create Viva Amazonia tourism marketplace"
```

Para publicar e abrir um Pull Request, crie um repositório remoto (GitHub/GitLab), configure o remote e envie uma branch:

```bash
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
git checkout -b feat/tourism-marketplace
git push -u origin feat/tourism-marketplace
```

Depois, abra o Pull Request da branch `feat/tourism-marketplace` para `main` na plataforma Git. Não foi criado PR remoto porque nenhum repositório ou credencial foi fornecido.

## Escopo e limitações da demonstração

- Não há integração com gateway de pagamento; o checkout confirma a reserva diretamente.
- Não há painel administrativo para cadastro/edição de passeios.
- O banco em memória perde os dados ao reiniciar.
- Não foram criados testes automatizados, conforme solicitado.
- Antes de produção, configurar segredo JWT forte, HTTPS, banco persistente, rate limiting, validação de entrada, logs e política de privacidade.
