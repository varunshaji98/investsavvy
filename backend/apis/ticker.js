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

// Handle MySQL query to fetch historical stock data
const getHistoricalData = (symbol, callback) => {
    const query = `SELECT Date, Close FROM ${symbol} ORDER BY Date ASC`;

    db.connection.query(query, (error, results) => {
        if (error) {
            console.error(`Error fetching historical data for ${symbol}:`, error);
            callback(error, null);
        } else {
            const closeValues = results.map(result => result.Close);
            callback(null, { closeValues });
        }
    });
};

// Serve the historical stock data based on the symbol
router.get('/ticker/historical-data/:symbol', (req, res) => {
    const symbol = req.params.symbol.toUpperCase();

    getHistoricalData(symbol, (error, data) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (data) {
            res.json(data);
        } else {
            res.status(404).json({ error: 'Symbol not found' });
        }
    });
});

// Function to fetch latest data for a stock from the database
const getLatestData = (symbol, callback) => {
    const query = `SELECT Date, Close, Volume, Open, High, Low, (Close - LAG(Close) OVER (ORDER BY Date)) / LAG(Close) OVER (ORDER BY Date) * 100 AS PercentageChange
                    FROM ${symbol} ORDER BY Date DESC LIMIT 1;`;

    db.connection.query(query, (error, results) => {
        if (error) {
            console.error(`Error fetching latest data for ${symbol}:`, error);
            callback(error, null);
        } else {
            if (results.length > 0) {
                // Extract relevant data from the query results
                const latestData = {
                    Date: results[0].Date,
                    Close: results[0].Close,
                    Volume: results[0].Volume,
                    PercentageChange: results[0].PercentageChange
                };
                callback(null, latestData);
            } else {
                callback(null, null); // No data found for the symbol
            }
        }
    });
};

// Serve latest stock data for a symbol
router.get('/ticker/latest-data/:symbol', (req, res) => {
    const symbol = req.params.symbol.toUpperCase();

    getLatestData(symbol, (error, data) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (data) {
            res.json(data);
        } else {
            res.status(404).json({ error: 'Data not found for symbol' });
        }
    });
});

module.exports = { router };