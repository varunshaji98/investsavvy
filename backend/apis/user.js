// Module for processing API /user endpoints 
const db = require("../database");
const express = require("express");
let router = express.Router();

// GET /user/all
// Description : Get a list of users
router.get("/user/all", (request, response) => {
  db.connection.query("SELECT * from Users", (errors, results) => {
    if (errors) {
      console.log(errors);
      response.status(500).send("Internal Server Error");
    } else {
      response.status(200).send(results);
    }
  });
});

// GET /user/by_uid
// Description : Get user info by user_id
router.get("/user/by_uid", (request, response) => {
  db.connection.query(`SELECT * from Users where id = ${request.query.id}`, (errors, results) => {
    if (errors) {
      console.log(errors);
      response.status(500).send("Internal Server Error");
    } else {
      response.status(200).send(results);
    }
  });
});

// POST /user/create
// Description : Create a new user
router.post("/user/create", (request, response) => {
    db.connection.query(
    `INSERT into Users (first_name, last_name, email, password_hash, user_type) 
     VALUES ('${request.body.first_name}','${request.body.last_name}','${request.body.email}', '${request.body.password_hash}', '${request.body.user_type}')`, (errors) => {
        if (errors) {
        console.log(errors);
        response.status(500).send("Internal Server Error");
        } else {
        // Send back the newly created user entry
        db.connection.query(`SELECT * from Users where email='${request.body.email}'`, (errors, results) => {
            if (errors) {
                console.log(errors);
                response.status(404).send("Record not added properly");
            } else {
                response.status(200).send(results);
            }
        });
      }
    });
});

// PATCH /user/by_uid
// Description : Modify the user password hash
router.patch("/user/by_uid", (request, response) => {
    db.connection.query(`UPDATE Users SET password_hash = ${request.body.password_hash} where id = ${request.query.id}`, (errors) => {
      if (errors) {
        console.log(errors);
        response.status(500).send("Internal Server Error");
      } else {
        response.status(200).send("Password updated");
      }
    });
  });
  
// [TO-DO] DELETE /user/by_uid
// Description : Delete an existing user. Also delete all their survey results and watchlists

module.exports = { router };