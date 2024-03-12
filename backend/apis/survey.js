// Module for processing API /survey endpoints 
const utils = require("../utils");
const db = require("../database");
const express = require("express");
let router = express.Router();

// GET /survey/all_users
// Description : Get the survey answers of all users
router.get("/survey/all", (request, response) => {
    db.connection.query(`SELECT * from Survey_Results`, (errors, results) => {
      if (errors) {
        console.log(errors);
        response.status(500).send("Internal Server Error");
      } else {
        if (utils.isEmptyObject(results))
            response.status(404).send("No records found");
        else
            response.status(200).send(results);
      }
    });
  });

// GET /survey/by_uid
// Description : Get the survey answer of a specific user
router.get("/survey/by_uid", (request, response) => {
    db.connection.query(`SELECT * from Survey_Results where user_id=${request.query.user_id}`, (errors, results) => {
      if (errors) {
        console.log(errors);
        response.status(500).send("Internal Server Error");
      } else {
        if (utils.isEmptyObject(results))
            response.status(404).send("No records found");
        else
            response.status(200).send(results);
      }
    });
  });

// POST /survey/by_uid
// Description : Record a survey answer for a specific user
router.post("/survey/by_uid", (request, response) => {
    // [TO-DO] Calculate risk score and assign risk profile
    db.connection.query(
    `INSERT into Survey_Results (user_id, age, occupation, income, risk_tolerance, investment_experience, time_horizon, investment_goal, investment_knowledge) 
     VALUES (${request.body.user_id}, ${request.body.age}, ${request.body.occupation}, ${request.body.income}, ${request.body.risk_tolerance},
             ${request.body.investment_experience}, ${request.body.time_horizon}, ${request.body.investment_goal}, ${request.body.investment_knowledge})`, (errors, results) => {
      if (errors) {
        console.log(errors);
        response.status(500).send("Internal Server Error");
      } else {
        response.status(200).send("Survey results added");
      }
    });
  });

// [TO-DO] PATCH /survey/by_uid
// Description : Modify a survey answer for a specific user
// [TO-DO] Recalculate risk score and assign risk profile

// [TO-DO] DELETE /survey/by_uid
// Description : Modify a survey answer for a specific user

module.exports = { router };