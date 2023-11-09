const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/contactRoutes");
const usersRouter = require("./routes/usersRouters");
const authRoutes = require("./routes/authRoutes");
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// app.use("/api/contacts", contactsRouter);
app.use("/users", usersRouter);
// app.use("/auth/verify", authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found 404" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server Error!" } = err;
  res.status(status).json({ message });
});

module.exports = app;
