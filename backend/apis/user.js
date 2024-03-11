// Module for processing API /user endpoints 

const express = require("express");
const db = require("../database");

let router = express.Router();

router.get("/user", (request, response) => {
  db.connection.query("select * from Users", (errors, results) => {
    if (errors) {
      console.log(errors);
      response.status(500).send("Internal Server Error");
    } else {
      response.send(results);
    }
  });
});

module.exports = { router };