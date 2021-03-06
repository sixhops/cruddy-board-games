var express = require('express');
var methodOverride = require('method-override');
var db = require("./models");
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/static"));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));

app.get('/', function(req, res) {
  res.render("index");
});

// GET /games - gets all games
app.get("/games", function(req, res) {
  // Try and get all records
  db.game.findAll().then(function(games) {
    // Find data within data object
    console.log(games);
    // res.render data into ejs page
    res.render("games/index", {games});
  });
});

// GET /games/3 - gets one game
app.get("/games/:id", function(req, res) {
  db.game.findById(parseInt(req.params.id)).then(function(game) {
    res.render("games/show", {game: game});
  });
});

// GET /games/3/edit - returns the populated edit form
app.get('/games/:id/edit', function(req, res) {
  db.game.findById(parseInt(req.params.id)).then(function(game) {
    res.render("games/edit", {game: game});
  });
});

app.put("/games/:id", function(req, res) {
  db.game.update({
    name: req.body.name,
    description: req.body.description,
    players: parseInt(req.body.players)
  }, {
    where: {id: parseInt(req.params.id)}
  }).then(function(data) {
    res.redirect("/games/" + parseInt(req.params.id));
  }).catch(function(err) {
    res.send(err.errors[0].message);
  });
});

app.listen(3000);
