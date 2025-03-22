// src/domain/entities/Cliente.js
class Cliente {
  constructor(id, nome, email, cpf) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
  }
}

module.exports = Cliente;