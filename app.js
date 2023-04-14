//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save().then(function(){
      res.render("secrets");
    });

  });

});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}).then(function(foundUser){
    if (foundUser) {

      bcrypt.compare(password, foundUser.password, function(err, result) { // foundUser.password is the hash stored in DB
          if (result === true) {
            res.render("secrets");
          }
      });

    }

    console.log(foundUser.password);
  
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
