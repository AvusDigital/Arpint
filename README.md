# Arpint Site — Loja demonstrativa

## O que já funciona
- Home premium com logo Arpint.
- Tema claro/escuro persistente em localStorage.
- Catálogo com busca, categorias e ordenação.
- Página individual de produto.
- Carrinho persistente em localStorage.
- Quantidade, remoção e resumo.
- Simulador de frete com consulta de CEP via ViaCEP e estimativa de PAC/SEDEX.
- Checkout demonstrativo com cartão/PIX/boleto.
- Validação Luhn para cartão em modo demonstração.
- Página de compra realizada.
- Produtos centralizados em `data/produtos.json`.

## Importante sobre Correios
A API oficial de preços dos Correios exige autenticação/credenciais e, conforme a documentação atual, é restrita a clientes de contrato. O simulador desta versão é uma estimativa demonstrativa. Para produção, substitua a função de cálculo em `assets/js/carrinho.js` por um backend/proxy autenticado com a API oficial.

## Imagens
Coloque as fotos reais dos produtos em `assets/images/produtos/` e altere o campo `imagem` no `data/produtos.json`.
