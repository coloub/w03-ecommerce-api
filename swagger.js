const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRUD API',
      version: '1.0.0',
      description: 'API documentation for the CRUD API project',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
            name: { type: 'string', example: 'Sample Product' },
            description: { type: 'string', example: 'A sample product description' },
            price: { type: 'number', example: 49.99 },
            category: { type: 'string', example: 'Electronics' },
            brand: { type: 'string', example: 'SampleBrand' },
            inStock: { type: 'boolean', example: true },
            quantity: { type: 'number', example: 10 },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['tag1', 'tag2']
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        ProductInput: {
          type: 'object',
          required: ['name', 'description', 'price', 'category', 'brand', 'quantity'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
            brand: { type: 'string' },
            quantity: { type: 'number' },
            tags: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        ProductUpdateInput: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
            brand: { type: 'string' },
            quantity: { type: 'number' },
            tags: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
            userId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
            orderNumber: { type: 'string', example: 'ORD-1624387200000-123' },
            customerName: { type: 'string', example: 'John Doe' },
            customerEmail: { type: 'string', example: 'john@example.com' },
            customerPhone: { type: 'string', example: '+1234567890' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  productName: { type: 'string' },
                  quantity: { type: 'number' },
                  price: { type: 'number' }
                }
              }
            },
            totalAmount: { type: 'number', example: 99.98 },
            status: { type: 'string', example: 'pending' },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        OrderInput: {
          type: 'object',
          required: ['customerName', 'customerEmail', 'customerPhone', 'items', 'shippingAddress'],
          properties: {
            customerName: { type: 'string' },
            customerEmail: { type: 'string' },
            customerPhone: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['productId', 'quantity'],
                properties: {
                  productId: { type: 'string' },
                  quantity: { type: 'number' }
                }
              }
            },
            shippingAddress: {
              type: 'object',
              required: ['street', 'city', 'state', 'zipCode'],
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' }
              }
            },
            status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] }
          }
        },
        OrderUpdateInput: {
          type: 'object',
          properties: {
            customerName: { type: 'string' },
            customerEmail: { type: 'string' },
            customerPhone: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  quantity: { type: 'number' }
                }
              }
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' }
              }
            },
            status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
