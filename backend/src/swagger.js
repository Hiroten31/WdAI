import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StoryForge API',
      version: '1.0.0',
      description: 'API for managing story projects, notes, and tags',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
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
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            user_id: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Note: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            project_id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            content: { type: 'string' },
            parent_note_id: { type: 'integer', nullable: true },
            position: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Tag: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            project_id: { type: 'integer' },
            name: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
