const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Opções do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Fast Food',
      version: '1.0.0',
      description: 'API para gerenciamento de pedidos de fast food',
      contact: {
        name: 'Equipe FastFood',
        email: 'contato@fastfood.com'
      }
    },
    servers: [
      {
        url: '/',
        description: 'Servidor de produção'
      }
    ],
    tags: [
      {
        name: 'Pedidos',
        description: 'Operações relacionadas a pedidos'
      },
      {
        name: 'Categorias',
        description: 'Operações relacionadas a categorias de produtos'
      },
      {
        name: 'Status',
        description: 'Verificação de status da API'
      }
    ],
    components: {
      schemas: {
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único do pedido'
            },
            customerName: {
              type: 'string',
              description: 'Nome do cliente'
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'PREPARING', 'READY', 'DELIVERED'],
              description: 'Status do pedido'
            },
            items: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Lista de itens do pedido'
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único da categoria'
            },
            name: {
              type: 'string',
              description: 'Nome da categoria'
            }
          }
        },
        HealthStatus: {
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
          responses: {
            '200': {
              description: 'API funcionando normalmente',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/HealthStatus'
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
          summary: 'Verificar disponibilidade da API',
          responses: {
            '200': {
              description: 'API pronta para receber requisições',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/HealthStatus'
                  }
                }
              }
            }
          }
        }
      },
      '/api/orders': {
        get: {
          tags: ['Pedidos'],
          summary: 'Listar todos os pedidos',
          responses: {
            '200': {
              description: 'Lista de pedidos obtida com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      orders: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Order'
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
      '/api/categories': {
        get: {
          tags: ['Categorias'],
          summary: 'Listar todas as categorias',
          responses: {
            '200': {
              description: 'Lista de categorias obtida com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      categories: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Category'
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
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = (app) => {
  // Interface do Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Endpoint JSON para o Swagger
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('Swagger configurado: /api-docs');
};