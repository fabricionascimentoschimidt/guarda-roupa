# Guarda-roupa do Fabricio

Armário virtual estático (HTML/CSS/JS puro, sem build), publicado no GitHub Pages.

## Como adicionar uma peça

1. Remova o fundo da foto (no box): `rembg i foto.jpg img/camiseta-preta.png`
2. Coloque o PNG em `img/`.
3. Adicione um objeto em `data/pecas.json`:

```json
{
  "id": "camiseta-preta-01",
  "nome": "Camiseta básica preta",
  "categoria": "Camisetas",
  "cor": "Preto",
  "cor_hex": "#111111",
  "marca": "Marca",
  "tamanho": "M",
  "tecido": "100% algodão",
  "link": "https://...",
  "foto": "img/camiseta-preta.png",
  "data_compra": "2026-10-13",
  "observacoes": ""
}
```

Categorias válidas: Camisetas, Regatas, Polos, Camisas, Bermudas, Moletons, Calçados, Acessórios.

## Como adicionar um look

Em `data/looks.json`:

```json
{ "id": "look-01", "nome": "Casual de sábado", "ocasiao": "Passeio", "pecas": ["camiseta-preta-01"], "observacoes": "" }
```

Faça commit e push na `main`; o Pages atualiza em ~1 minuto.
