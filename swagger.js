const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Bhalu API documentation",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express for Bhalu APP.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "Sharukh",
      email: "sdsharukh9@gmail.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/",
      description: "Development server",
    },
    {
      url: "http://bhalu.io/",
      description: "Production server",
    },
  ],
};

const SwaggerOptions = {
  swaggerDefinition,
  // Path to the API docs
  apis: ["./server/routes/*.js"],
};

module.exports = SwaggerOptions;
