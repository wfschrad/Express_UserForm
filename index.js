const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const { check, validationResult } = require("express-validator");


const app = express();
const port = process.env.PORT || 3000;
const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];


app.set("view engine", "pug");
app.use(cookieParser());
app.use(express.urlencoded());
const csrfProtection = csrf({ cookie: true });

function validationMiddleware(req, res, next) {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  const errors = [];

  if (!firstName) {
    errors.push("Please provide a first name.");
  }
  if (!lastName) {
    errors.push("Please provide a last name.");
  }
  if (!email) {
    errors.push("Please provide an email.");
  }
  if (!password) {
    errors.push("Please provide a password.");
  }
  if (password && password !== confirmedPassword) {
    errors.push("The provided values for the password and password confirmation fields did not match.");
  };

  req.errors = errors;
  next();
}

function validationMiddlewareInteresting(req, res, next) {
  const { firstName, lastName, email, password, confirmedPassword, age, favoriteBeatle } = req.body;
  const errors = [];

  if (!firstName) {
    errors.push("Please provide a first name.");
  }
  if (!lastName) {
    errors.push("Please provide a last name.");
  }
  if (!email) {
    errors.push("Please provide an email.");
  }
  if (!password) {
    errors.push("Please provide a password.");
  }
  if (password && password !== confirmedPassword) {
    errors.push("The provided values for the password and password confirmation fields did not match.");
  };
  if (!age) {
    errors.push("age is required.");
  }
  if (!favoriteBeatle) {
    errors.push("Please choose favorite Beatle!.");
  };


  req.errors = errors;
  next();
}

app.get("/", (req, res) => {
  //res.send("Hello World!");
  res.render("index", { users });
});

app.get("/create", csrfProtection, (req, res) => {

  res.render("form-basic", { title: "User Form", csrfToken: req.csrfToken(), errors:[] })
});

app.post("/create", csrfProtection, validationMiddleware, (req, res) => {
  //console.log("errors: ", errors)
  
  if (req.errors.length > 0) {
    res.render("form-basic", { title: "User Form", csrfToken: req.csrfToken(), errors: req.errors, ...req.body});
    return;
  }
  else {
    //add user
    users.push({id: users.length+1, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email});

    //redirect
    res.redirect("/");
  }

});

app.get("/create-interesting", csrfProtection, (req, res) => {
  res.render("form-interesting", { 
    title: 'Create an interesting user', 
    errors: [], 
    csrfToken: req.csrfToken()});
});

app.post(
  "/create-interesting",
  csrfProtection, validationMiddlewareInteresting, [
    check("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long")
      .matches(/\d/)
      .withMessage("must contain a number"),
    check("age")
      .exists({ checkFalsy: true })
      .withMessage("is required"),
    check("age")
      .isInt({ min: 0, max: 120 })
      .withMessage("must be a valid age"),
    check("favoriteBeatle")
      .exists({ checkFalsy: true })
      .withMessage("is required"),
    check("favoriteBeatle")
      .isIn(["John", "Paul", "Ringo", "George"])
      .withMessage("must be a real Beatle member")
  ],
  (req, res) => {
    const validatorErrors = validationResult(req).errors.map(
      ({ msg, param }) => `${param} ${msg}`
    );

    const errors = req.errors.concat(validatorErrors);
    if (errors.length > 0) {
      res.render("form-interesting", {
        title: "Create an interesting user",
        ...req.body,
        csrfToken: req.csrfToken(),
        errors
      });
      return;
    }
    const {
      firstName,
      lastName,
      email,
      favoriteBeatle,
      iceCream,
      age
    } = req.body;

    users.push({
      id: users.length + 1,
      firstName,
      lastName,
      email,
      favoriteBeatle,
      iceCream: iceCream === "on",
      age
    });
    res.redirect("/");
  }
);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
