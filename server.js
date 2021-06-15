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
const usersRouter = require("./server/routes/users");
const authReq = require("./server/middlewares/authenticateRequests");
require("./server/config/mongoConnection.js");
require("./server/middlewares/cors")(app);
const SwaggerOptions = require("./swagger");
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(publicPath));
app.use("/api/auth", usersRouter);
app.use("/api/", authReq.authenticateRequests);
app.use("/api", reviewsRouter);
const specs = swaggerJSDoc(SwaggerOptions);
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
  console.log("404");
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
