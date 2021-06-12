const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      credentials: true,
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5000",
        "http://bhalu.io",
        "https://bhalu.io",
        "http://www.bhalu.io",
        "https://www.bhalu.io",
        "http://bhalu.herokuapp.com",
        "https://bhalu.herokuapp.com",
      ],
    })
  );
};
