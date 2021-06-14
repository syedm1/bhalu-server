const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();
const logger = require("morgan");
const swaggerJSDoc = require("swagger-jsdoc");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const reviewsRouter = require("./server/routes/reviews");
const publicPath = path.join(__dirname, ".", "public");
require("./server/config/mongoConnection.js");
require("./server/middlewares/cors")(app);
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for JSONPlaceholder",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves data from JSONPlaceholder.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "JSONPlaceholder",
      url: "https://jsonplaceholder.typicode.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api/reviews",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  // Path to the API docs
  apis: ["./server/routes/reviews.js"],
};

app.use(express.static(publicPath));

app.use("/api", reviewsRouter);
const specs = swaggerJSDoc(options);
app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.get("/*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => {
  console.log("Server is up!");
});
