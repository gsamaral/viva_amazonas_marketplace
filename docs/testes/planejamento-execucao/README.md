# Planejamento e execução de testes

Esta pasta concentra os documentos de planejamento e os registros de execução
dos testes do marketplace Viva Amazônia.

## Objetivo

- Definir o escopo, a estratégia e a abordagem de testes.
- Registrar cenários, casos de teste, dados e pré-condições.
- Planejar a execução por ambiente, tipo de teste e responsável.
- Consolidar evidências, resultados, métricas e defeitos encontrados.

## Documentos

| Documento | Conteúdo |
| --- | --- |
| [Plano_e_Estrategia_de_Testes_Adaptada.docx](Plano_e_Estrategia_de_Testes_Adaptada.docx) | Plano adaptado ao projeto, com escopo, estratégia e critérios de qualidade. |
| [Plano_Estrategia_e_Automacao_Web_API_Revisado.docx](Plano_Estrategia_e_Automacao_Web_API_Revisado.docx) | Plano revisado para automação de testes Web e API. |

## Estratégia geral

A validação deve combinar testes funcionais, automatizados e não funcionais:

- **Testes de API:** contratos, autenticação, regras de negócio e respostas HTTP.
- **Testes Web:** fluxos completos realizados pela interface.
- **Testes de performance:** carga, tempo de resposta e concorrência.
- **Testes exploratórios:** cenários não previstos pelo planejamento formal.
- **Testes de regressão:** validação das funcionalidades após correções e mudanças.

Os principais critérios de qualidade são:

1. Casos críticos de autenticação e reserva devem ser validados.
2. O carrinho e o checkout devem respeitar a disponibilidade real das vagas.
3. Falhas de validação devem retornar respostas claras e consistentes.
4. Dados do banco em memória devem ser restaurados em cada inicialização da API.

## Escopo mínimo

### Em escopo

- Cadastro e autenticação de usuários.
- Consulta e filtro do catálogo de passeios.
- Adição de itens ao carrinho e alteração de participantes.
- Checkout autenticado e criação de reservas.
- Validação de vagas, totais e ofertas promocionais.
- Disponibilidade dos endpoints e da interface em ambiente local.

### Fora do escopo inicial

- Integrações reais com gateway de pagamento.
- Painel administrativo para gestão de passeios.
- Persistência de dados em banco externo.
- Testes de segurança aprofundados e auditoria de conformidade.
- Testes de alta carga em infraestrutura de produção.

## Pré-condições

Antes da execução, confirmar:

- Dependências instaladas com `npm install`.
- Arquivo `.env` criado a partir de `.env.example`.
- API disponível em `http://localhost:4000`.
- Aplicação Web disponível em `http://localhost:5173`.
- Usuários e dados de demonstração carregados pela API.
- Ferramentas necessárias para execução instaladas no ambiente.

Os usuários de demonstração e a senha padrão estão descritos no
[README principal](../../../README.md).

## Fluxo de execução

1. Confirmar a versão do código e o ambiente de testes.
2. Executar os testes automatizados aplicáveis.
3. Executar cenários manuais ou exploratórios não cobertos pela automação.
4. Registrar o resultado de cada caso: aprovado, reprovado, bloqueado ou não executado.
5. Documentar defeitos com reprodução, resultado esperado e resultado obtido.
6. Anexar evidências, como capturas de tela, logs e respostas HTTP.
7. Reexecutar os casos afetados após a correção.

## Critérios de entrada

- Ambiente disponível e configurado.
- Banco de dados em memória inicializado.
- Requisitos e regras de negócio acessíveis.
- Casos de teste e dados preparados.
- Versão candidata identificada.

## Critérios de saída

- Casos críticos aprovados.
- Nenhum defeito crítico ou de alta prioridade aberto.
- Defeitos conhecidos registrados e analisados.
- Evidências e métricas de execução registradas.
- Relatório final aprovado pelos responsáveis.

## Modelos de registro

Ao registrar um caso de teste, incluir:

| Campo | Exemplo |
| --- | --- |
| Identificador | CT-AUTH-001 |
| Objetivo | Validar login com credenciais válidas. |
| Pré-condições | Usuário de demonstração cadastrado. |
| Dados | `ana@exemplo.com` |
| Passos | Acessar login, informar os dados e confirmar. |
| Resultado esperado | Usuário autenticado e redirecionado ao catálogo. |
| Resultado obtido | Redirecionamento realizado e sessão criada. |
| Status | Aprovado |
| Evidência | Captura de tela ou resposta da API |
| Defeito associado | `BUG-001`, quando aplicável |

## Defeitos

Cada defeito deve conter, sempre que possível:

- Identificador e título.
- Ambiente e versão testada.
- Passos para reprodução.
- Resultado esperado e resultado obtido.
- Severidade e prioridade.
- Evidências.
- Responsável e situação.

## Documentação relacionada

- [Testes de API](../../../tests/api/README.md)
- [Testes end-to-end](../../../tests/e2e/README.md)
- [Testes de performance](../../../tests/performance/README.md)
- [Especificação OpenAPI](../../openapi.yaml)

