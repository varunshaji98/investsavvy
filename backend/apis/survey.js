// Module for processing API /survey endpoints 
const db = require("../database");
const express = require("express");
let router = express.Router();

// GET /survey/all_users
// Description : Get the survey answers of all users
router.get("/survey/by_uid", (request, response) => {
    db.connection.query(`SELECT * from Surveys`, (errors, results) => {
      if (errors) {
        console.log(errors);
        response.status(500).send("Internal Server Error");
      } else {
        response.status(200).send(results);
      }
    });
  });

// GET /survey/by_uid
// Description : Get the survey answer of a specific user
router.get("/survey/by_uid", (request, response) => {
    db.connection.query(`SELECT * from Surveys where user_id=${request.query.user_id}`, (errors, results) => {
      if (errors) {
        console.log(errors);
        response.status(500).send("Internal Server Error");
      } else {
        response.status(200).send(results);
      }
    });
  });

// POST /survey/by_uid
// Description : Record a survey answer for a specific user

// PATCH /survey/by_uid
// Description : Modify a survey answer for a specific user

// DELETE /survey/by_uid
// Description : Modify a survey answer for a specific user