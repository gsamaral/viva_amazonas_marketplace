# Testes automatizados end-to-end

Os testes end-to-end usam Playwright para validar os principais fluxos da interface
Viva Amazônia em um navegador Chromium.

## Executar

Na raiz do projeto:

```bash
npx playwright install chromium
npm run test:e2e
```

O Playwright inicia automaticamente a API e a aplicação Web com `npm run dev`.
Caso os servidores já estejam ativos na porta 4000 ou 5173, o teste reutiliza a execução.

## Casos cobertos

- Exibição dos passeios em destaque.
- Filtro por texto.
- Filtro por cidade.
- Login com credenciais inválidas.
- Login com credenciais válidas.
- Inclusão e alteração da quantidade no carrinho.
- Finalização de uma reserva autenticada.

Capturas e rastros são gerados automaticamente quando um teste falha.

