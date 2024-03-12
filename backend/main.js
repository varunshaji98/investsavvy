// Main module which initialises backend server

const express = require("express");
const user = require("./apis/user");
const survey = require("./apis/survey");

let server = express();
server.use(express.json());
server.use(user.router);
server.use(survey.router);

server.listen(3000, (errors) => {
  if (errors) {
    console.log("Could not start the server. Error: " + errors);
  } else {
    console.log("Server started on port 3000");
  }
});