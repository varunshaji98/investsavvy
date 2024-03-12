const utils = require("../utils");
const db = require("../database");
const express = require("express");
let router = express.Router();

// GET /watchlist/by_user
// Description : Get watchlist (list of tickers) of a user
router.get("/watchlist/by_user", (request, response) => {
    db.connection.query(`SELECT * FROM Tickers WHERE id IN ` + 
                        `(SELECT ticker_id FROM Watchlist where user_id = ${request.query.user_id})`, (errors, results) => {
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

// POST /watchlist/add_to_user
// Description : Add to a watchlist of a user
// [TO-DO] Add functionality of adding multiple tickers to watchlist at once
router.post("/watchlist/add_to_user", (request, response) => {
    db.connection.query(`INSERT INTO Watchlist (user_id, ticker_id) VALUES (${request.body.user_id}, ${request.body.ticker_id})`, (errors, results) => {
        if (errors) {
            console.log(errors);
            response.status(500).send("Internal Server Error");
        } else {
            response.status(200).send("Added to watchlist");
        }
    });
});

// DELETE /watchlist
// Description : Delete a specific watchlist entry
router.delete("/watchlist", (request, response) => {
    db.connection.query(`DELETE FROM Watchlist WHERE user_id = ${request.body.user_id} AND ticker_id = ${request.body.ticker_id})`, (errors, results) => {
        if (errors) {
            console.log(errors);
            response.status(500).send("Internal Server Error");
        } else {
            response.status(200).send("Deleted from watchlist");
        }
    });
});

module.exports = { router };