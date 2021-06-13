const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());

require("./config/mongoConnection.js");
const swaggerUi = require("swagger-ui-express");
const reviewsRouter = require("./api/reviews");
var { swaggerDocument } = require("./swagger");
const publicPath = path.join(__dirname, "..", "public");
require("./middlewares/cors")(app);
const port = process.env.PORT || 3000;

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", reviewsRouter);
app.use(express.static(publicPath));
app.get("/*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, () => {
  console.log("Server is up!");
});
