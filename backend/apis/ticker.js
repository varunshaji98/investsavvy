// Module for processing API /ticker endpoints 
const utils = require("../utils");
const db = require("../database");
const express = require("express");
let router = express.Router();

// GET /ticker/all
// Description : Get a list of all tickers
router.get("/ticker/all", (request, response) => {
    db.connection.query("SELECT * FROM Tickers", (errors, results) => {
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

// GET /ticker/by_riskprofile
// Description : Get a list of tickers by risk profile
router.get("/ticker/by_riskprofile", (request, response) => {
    db.connection.query(`SELECT * FROM Tickers WHERE risk_profile_id=${request.query.rpid}`, (errors, results) => {
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

// GET /ticker/by_type
// Description : Get a list of tickers by type
router.get("/ticker/by_type", (request, response) => {
    db.connection.query(`SELECT * FROM Tickers WHERE type='${request.query.type}'`, (errors, results) => {
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

// GET /ticker/by_symbol
// Description : Find a ticker by symbol
router.get("/ticker/by_symbol", (request, response) => {
    db.connection.query(`SELECT * FROM Tickers WHERE symbol='${request.query.symbol}'`, (errors, results) => {
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

module.exports = { router };