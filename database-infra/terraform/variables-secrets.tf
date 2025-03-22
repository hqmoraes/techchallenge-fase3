# Variáveis para Secrets Manager

variable "mercado_pago_token" {
  description = "Token de acesso para integração com Mercado Pago"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "Segredo usado para assinar tokens JWT"
  type        = string
  sensitive   = true
}
