var mongoose = require("mongoose");
const connectionUrl =
  "mongodb+srv://bhaluAdmin:abcd.1234@clusterthechosenone.egbzk.mongodb.net/bhaluDatabase?retryWrites=true&w=majority";

mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "DB connection error:"));
db.once("open", function () {
  console.log("Successfully connected to DB");
});
