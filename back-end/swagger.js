const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Generic CRUD API",
    version: "1.0.0",
    description:
      "A simple Node.js API that provides CRUD operations for any entity type using a JSON file as a database",
    contact: {
      name: "API Support",
      url: "https://example.com",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Entity: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the entity",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the entity was created",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the entity was last updated",
          },
        },
        additionalProperties: true,
      },
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the user",
          },
          name: {
            type: "string",
            description: "User's name",
          },
          email: {
            type: "string",
            description: "User's email address",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the user was created",
          },
        },
      },
      Country: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the country",
          },
          name: {
            type: "string",
            description: "Country name",
          },
          isoCode: {
            type: "string",
            description: "ISO country code",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the record was created",
          },
        },
      },
      Community: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the autonomous community",
          },
          name: {
            type: "string",
            description: "Autonomous community name",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the record was created",
          },
        },
      },
      Province: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the province",
          },
          name: {
            type: "string",
            description: "Province name",
          },
          communityId: {
            type: "string",
            description:
              "Reference to the autonomous community this province belongs to",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the record was created",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Error message",
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
