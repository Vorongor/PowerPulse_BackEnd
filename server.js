const express = require("express");
require("dotenv").config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const secretKey = process.env.SECRET_KEY;

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Привіт, це ваш REST API!");
});

app.listen(port, () => {
  console.log(`Сервер слухає на порту ${port}`);

  console.log(
    `Підключення до бази даних на ${dbHost} як ${dbUser} з ключем ${secretKey}`
  );
});
