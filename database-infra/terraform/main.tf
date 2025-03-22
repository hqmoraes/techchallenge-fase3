# Tabela de Clientes
resource "aws_dynamodb_table" "fast_food_clients" {
  name         = "dev-FastFoodClients"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "CPF"
  
  # Chaves e atributos conforme especificação
  attribute {
    name = "CPF"
    type = "S"
  }
  
  # Outros atributos e configurações
  
  # Aumentar timeout para criação e atualização
  timeouts {
    create = "30m"
    update = "30m"
    delete = "30m"
  }
  
  tags = {
    Name        = "FastFoodClients"
    Environment = "dev"
    Project     = "TechChallenge"
  }
}

# Tabela de Produtos
resource "aws_dynamodb_table" "fast_food_products" {
  name           = "${var.environment}-FastFoodProducts"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "ProdutoId"

  attribute {
    name = "ProdutoId"
    type = "S"
  }

  attribute {
    name = "CategoriaId"
    type = "S"
  }

  global_secondary_index {
    name               = "CategoriaIndex"
    hash_key           = "CategoriaId"
    projection_type    = "ALL"
    read_capacity      = 5
    write_capacity     = 5
  }

  tags = merge(var.tags, {
    Domain = "Catalog"
  })
}

# Tabela de Pedidos
resource "aws_dynamodb_table" "fast_food_orders" {
  name           = "${var.environment}-FastFoodOrders"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "PedidoId"

  attribute {
    name = "PedidoId"
    type = "S"
  }

  attribute {
    name = "ClienteId"
    type = "S"
  }

  attribute {
    name = "Status"
    type = "S"
  }

  global_secondary_index {
    name               = "ClienteIndex"
    hash_key           = "ClienteId"
    projection_type    = "ALL"
  }

  global_secondary_index {
    name               = "StatusIndex"
    hash_key           = "Status"
    projection_type    = "ALL"
  }

  tags = merge(var.tags, {
    Domain = "Orders"
  })
}

# Tabela de Pagamentos
resource "aws_dynamodb_table" "fast_food_payments" {
  name           = "${var.environment}-FastFoodPayments"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "PagamentoId"

  attribute {
    name = "PagamentoId"
    type = "S"
  }

  attribute {
    name = "PedidoId"
    type = "S"
  }

  global_secondary_index {
    name               = "PedidoIndex"
    hash_key           = "PedidoId"
    projection_type    = "ALL"
  }

  tags = merge(var.tags, {
    Domain = "Payments"
  })
}

# Tabela de Categorias
resource "aws_dynamodb_table" "fast_food_categories" {
  name           = "${var.environment}-FastFoodCategories"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "CategoriaId"

  attribute {
    name = "CategoriaId"
    type = "S"
  }

  tags = merge(var.tags, {
    Domain = "Catalog"
  })
}



