const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const engines = require("consolidate");
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose
  .connect("mongodb://localhost/mevn-users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    promiseLibrary: require("bluebird")
  })
  .then(() => console.log("connection successful")) // eslint-disable-line no-console
  .catch(err => console.error(err)); // eslint-disable-line no-console

const user = require("./routes/user");
const auth = require("./routes/auth");
const upload = require("./routes/file");
const expFile = require("./routes/export");
const chart = require("./routes/chart");

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(express.static(path.join(__dirname, "dist")));

app.use("/users", express.static(path.join(__dirname, "dist")));
app.use("/user", user);
app.use("/api/auth", auth);
app.use("/uploads", upload);
app.use("/exports", expFile);
app.use("/charts", chart);

//if the files size increase more than 500KB
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(422).json({ error: "Allowed file size is 500KB" });
    return;
  }
  if (err.code === "INCORRECT_FILETYPE") {
    res.status(422).json({ error: "Only image are allowed" });
    return;
  }
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.engine("html", engines.mustache);
app.set("view engine", "html");

module.exports = app;
