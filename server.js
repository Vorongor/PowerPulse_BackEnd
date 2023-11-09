require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

// const dbURL = process.env.MONGODB_URL;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log(`Підключено до MongoDB Atlas`);
});

db.on("error", (err) => {
  console.error("Помилка підключення до MongoDB Atlas:", err);
});

db.on("disconnected", () => {
  console.log("Відключено від MongoDB Atlas");
});

app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000");
});

module.exports = {
  db,
};
