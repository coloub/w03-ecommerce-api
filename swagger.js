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
        url: process.env.SWAGGER_SERVER_URL || 'http://localhost:3000',
        description: 'Server URL'
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
            category: { 
              type: 'string', 
              example: 'Electronics',
              enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other']
            },
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
            name: { type: 'string', example: 'Sample Product' },
            description: { type: 'string', example: 'A sample product description' },
            price: { type: 'number', example: 49.99 },
            category: { 
              type: 'string', 
              example: 'Electronics',
              enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other']
            },
            brand: { type: 'string', example: 'SampleBrand' },
            quantity: { type: 'number', example: 10 },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['tag1', 'tag2']
            }
          }
        },
        ProductUpdateInput: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Sample Product' },
            description: { type: 'string', example: 'A sample product description' },
            price: { type: 'number', example: 49.99 },
            category: { 
              type: 'string', 
              example: 'Electronics',
              enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other']
            },
            brand: { type: 'string', example: 'SampleBrand' },
            quantity: { type: 'number', example: 10 },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['tag1', 'tag2']
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
            customerName: { type: 'string', example: 'John Doe', description: 'Name of the customer' },
            customerEmail: { type: 'string', example: 'johndoe@example.com', description: 'Email address of the customer' },
            customerPhone: { type: 'string', example: '+1-123-456-7890', description: 'Phone number of the customer' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['productId', 'quantity'],
                properties: {
                  productId: { type: 'string', example: '64bfa8b1234abc001234abcd', description: 'ID of the product' },
                  quantity: { type: 'number', example: 3, description: 'Quantity of the product ordered' }
                }
              }
            },
            shippingAddress: {
              type: 'object',
              required: ['street', 'city', 'state', 'zipCode'],
              properties: {
                street: { type: 'string', example: '123 Main St', description: 'Street address' },
                city: { type: 'string', example: 'Anytown', description: 'City' },
                state: { type: 'string', example: 'CA', description: 'State or province' },
                zipCode: { type: 'string', example: '12345', description: 'Postal code' },
                country: { type: 'string', example: 'USA', description: 'Country' }
              }
            },
            status: { 
              type: 'string', 
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
              example: 'pending',
              description: 'Status of the order'
            }
          }
        },
        OrderUpdateInput: {
          type: 'object',
          properties: {
            customerName: { type: 'string', example: 'John Doe', description: 'Name of the customer' },
            customerEmail: { type: 'string', example: 'johndoe@example.com', description: 'Email address of the customer' },
            customerPhone: { type: 'string', example: '+1-123-456-7890', description: 'Phone number of the customer' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string', example: '64bfa8b1234abc001234abcd', description: 'ID of the product' },
                  quantity: { type: 'number', example: 3, description: 'Quantity of the product ordered' }
                }
              }
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string', example: '123 Main St', description: 'Street address' },
                city: { type: 'string', example: 'Anytown', description: 'City' },
                state: { type: 'string', example: 'CA', description: 'State or province' },
                zipCode: { type: 'string', example: '12345', description: 'Postal code' }
              }
            },
            status: { 
              type: 'string', 
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
              example: 'pending',
              description: 'Status of the order'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
