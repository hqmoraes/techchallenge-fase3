// src/domain/entities/Produto.js
class Produto {
  constructor(id, nome, descricao, preco, categoriaId) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this.categoriaId = categoriaId;
  }
}

module.exports = Produto;