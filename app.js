//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// Creation of database - Start
mongoose.connect("mongodb://0.0.0.0:27017/userDB", {useNewUrlParser:true});

const userSchema = new mongoose.Schema({ // Here we transform the ordinary Schema into an object so we can add properties to it later.
  email: String,
  password: String
});

// secret is the key to encrypt the database, it has to be a long string.
// It will be moved to .env file for security reasons. IT SHOULD NOT BE HERE.
// const secret = "ThisIsOurLittleSecret.";

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});
// encryptedFields makes that only the property inside brackets gets encrypted.
const User = new mongoose.model ("User", userSchema);

// Creation of database - End

app.get ("/", function(req, res){
  res.render("home");
});

app.get ("/login", function(req, res){
  res.render("login");
});

app.get ("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save().then(function(){
    res.render("secrets");
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}).then(function(foundUser){
    if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      }

      console.log(foundUser.password);
    }
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
