// src/domain/entities/Pagamento.js
class Pagamento {
  constructor(id, pedidoId, status, valor) {
    this.id = id;
    this.pedidoId = pedidoId;
    this.status = status;
    this.valor = valor;
  }
}

module.exports = Pagamento;