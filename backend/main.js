// Main module which initialises backend server

const express = require("express");
const cors = require('cors')
const user = require("./apis/user");
const survey = require("./apis/survey");
const ticker = require("./apis/ticker");
const watchlist = require("./apis/watchlist");

let server = express();
server.use(cors())
server.use(express.json());
server.use(user.router);
server.use(survey.router);
server.use(ticker.router);
server.use(watchlist.router);

server.get("/hello", (req, res) => {
  res.send("Hello");
});

server.listen(3000, (errors) => {
  if (errors) {
    console.log("Could not start the server. Error: " + errors);
  } else {
    console.log("Server started on port 3000");
  }
});