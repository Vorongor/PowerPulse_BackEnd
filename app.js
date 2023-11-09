const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const productsRouters = require("./routes/productsRouters");
const usersRouters = require("./routes/usersRouters");
const exercisesRouters = require("./routes/exercisesRouters");
const filtersRouters = require("./routes/filtersRouters");
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", usersRouters);
app.use("/products", productsRouters);
app.use("/exercises", exercisesRouters);
app.use("/filters", filtersRouters);

app.use((req, res) => {
  res.status(404).json({ message: "Not found 404" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server Error!" } = err;
  res.status(status).json({ message });
});

module.exports = app;
