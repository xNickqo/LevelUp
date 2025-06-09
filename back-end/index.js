require('dotenv').config();

const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

//RUTAS
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");
const locationRoutes = require("./routes/location");
const emailRoutes = require("./routes/email");
const stripeRoutes = require("./routes/stripe");

const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// API Routes
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);
app.use("/location", locationRoutes);
app.use("/email", emailRoutes);
app.use('/stripe', stripeRoutes);

// Swagger JSON
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic route for testing
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Generic CRUD API",
    documentation: "Check /api-docs for the API documentation",
    authentication: {
      signup: "POST /auth/signup",
      signin: "POST /auth/signin",
    },
    location: {
      getCountries: "GET /location/countries",
      getCommunities: "GET /location/communities",
      getProvincesByCommunity: "GET /location/provinces/:communityId",
    },
    endpoints: {
      getAllEntities: "GET /api/entities",
      getEntityById: "GET /api/entities/:id",
      createEntity: "POST /api/entities",
      updateEntity: "PUT /api/entities/:id",
      deleteEntity: "DELETE /api/entities/:id",
    },
    stripe: {
      checkout: "POST /stripe/checkout",
      staticPages: "GET /stripe-pages/checkout.html",
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
});
