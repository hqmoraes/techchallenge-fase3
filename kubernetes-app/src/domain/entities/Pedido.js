// src/domain/entities/Pedido.js
class Pedido {
  constructor(id, clienteId, produtos, status, pagamentoId) {
    this.id = id;
    this.clienteId = clienteId;
    this.produtos = produtos;
    this.status = status;
    this.pagamentoId = pagamentoId;
  }
}

module.exports = Pedido;