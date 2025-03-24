const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Definição OpenAPI
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fast Food API',
      version: '1.0.0',
      description: 'API para sistema de Fast Food da FIAP Postech Fase 3',
      contact: {
        name: 'Equipe Fast Food',
        email: 'contato@fastfood.com.br'
      },
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      }
    },
    servers: [
      {
        url: '/',
        description: 'Servidor de Produção'
      }
    ],
    tags: [
      {
        name: 'Pedidos',
        description: 'Gerenciamento de pedidos'
      },
      {
        name: 'Produtos',
        description: 'Gerenciamento de produtos'
      },
      {
        name: 'Categorias',
        description: 'Gerenciamento de categorias'
      },
      {
        name: 'Status',
        description: 'Verificação de status da API'
      }
    ],
    components: {
      schemas: {
        Pedido: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único do pedido'
            },
            cliente: {
              type: 'string',
              description: 'Nome do cliente'
            },
            status: {
              type: 'string',
              enum: ['RECEBIDO', 'EM_PREPARACAO', 'PRONTO', 'FINALIZADO'],
              description: 'Status do pedido'
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ItemPedido'
              }
            },
            valorTotal: {
              type: 'number',
              format: 'float',
              description: 'Valor total do pedido'
            },
            dataHora: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora de criação do pedido'
            }
          }
        },
        ItemPedido: {
          type: 'object',
          properties: {
            produtoId: {
              type: 'string',
              description: 'ID do produto'
            },
            nome: {
              type: 'string',
              description: 'Nome do produto'
            },
            quantidade: {
              type: 'integer',
              description: 'Quantidade do produto'
            },
            valorUnitario: {
              type: 'number',
              format: 'float',
              description: 'Valor unitário do produto'
            }
          }
        },
        Produto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único do produto'
            },
            nome: {
              type: 'string',
              description: 'Nome do produto'
            },
            descricao: {
              type: 'string',
              description: 'Descrição do produto'
            },
            preco: {
              type: 'number',
              format: 'float',
              description: 'Preço do produto'
            },
            categoriaId: {
              type: 'string',
              description: 'ID da categoria do produto'
            },
            imagem: {
              type: 'string',
              description: 'URL da imagem do produto'
            }
          }
        },
        Categoria: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único da categoria'
            },
            nome: {
              type: 'string',
              description: 'Nome da categoria'
            },
            descricao: {
              type: 'string',
              description: 'Descrição da categoria'
            }
          }
        },
        StatusResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'healthy'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    paths: {
      '/health': {
        get: {
          tags: ['Status'],
          summary: 'Verificar status de saúde da API',
          description: 'Verifica se a API está funcionando corretamente',
          responses: {
            '200': {
              description: 'API funcionando normalmente',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/StatusResponse'
                  }
                }
              }
            }
          }
        }
      },
      '/ready': {
        get: {
          tags: ['Status'],
          summary: 'Verificar se a API está pronta',
          description: 'Verifica se a API está pronta para receber requisições',
          responses: {
            '200': {
              description: 'API pronta para receber requisições',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/StatusResponse'
                  }
                }
              }
            }
          }
        }
      },
      '/api/pedidos': {
        get: {
          tags: ['Pedidos'],
          summary: 'Listar todos os pedidos',
          description: 'Retorna a lista de todos os pedidos',
          responses: {
            '200': {
              description: 'Lista de pedidos',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      pedidos: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Pedido'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Pedidos'],
          summary: 'Criar um novo pedido',
          description: 'Cria um novo pedido com os items especificados',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    cliente: {
                      type: 'string',
                      description: 'Nome do cliente'
                    },
                    items: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/ItemPedido'
                      }
                    }
                  },
                  required: ['cliente', 'items']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Pedido criado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Pedido'
                  }
                }
              }
            }
          }
        }
      },
      '/api/pedidos/{id}': {
        get: {
          tags: ['Pedidos'],
          summary: 'Obter pedido por ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Pedido encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Pedido'
                  }
                }
              }
            },
            '404': {
              description: 'Pedido não encontrado'
            }
          }
        }
      },
      '/api/pedidos/{id}/status': {
        put: {
          tags: ['Pedidos'],
          summary: 'Atualizar status do pedido',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['RECEBIDO', 'EM_PREPARACAO', 'PRONTO', 'FINALIZADO']
                    }
                  },
                  required: ['status']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Status atualizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Pedido'
                  }
                }
              }
            },
            '404': {
              description: 'Pedido não encontrado'
            }
          }
        }
      },
      '/api/produtos': {
        get: {
          tags: ['Produtos'],
          summary: 'Listar todos os produtos',
          description: 'Retorna a lista de todos os produtos',
          responses: {
            '200': {
              description: 'Lista de produtos',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      produtos: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Produto'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/categorias': {
        get: {
          tags: ['Categorias'],
          summary: 'Listar todas as categorias',
          description: 'Retorna a lista de todas as categorias',
          responses: {
            '200': {
              description: 'Lista de categorias',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      categorias: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Categoria'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./index.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

function setupSwagger(app) {
  // Rota para a documentação do Swagger UI
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Rota alternativa para o Swagger UI (compatibilidade)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Rota para o arquivo swagger.json
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('Swagger configurado nos endpoints:');
  console.log('- /swagger   - Interface Swagger UI principal');
  console.log('- /api-docs  - Interface Swagger UI alternativa');
  console.log('- /swagger.json - Arquivo de definição OpenAPI');
}

module.exports = setupSwagger;