const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Quick Pick API",
            version: "1.0.0",
            description: "API documentation for Quick Pick Production System"
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;