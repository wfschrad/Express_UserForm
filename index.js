const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
