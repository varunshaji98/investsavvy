const express = require('express');
const app = express();
const port = 3000;
const mysql = require("mysql");
require("dotenv").config();

const parameters = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
};

// Establish a connection to the database
const mysqlConnection = mysql.createConnection(parameters);

// Handle MySQL query to fetch historical stock data
const getHistoricalData = (symbol, callback) => {
    const query = `SELECT Date, Close FROM ${symbol} ORDER BY Date ASC`;

    mysqlConnection.query(query, (error, results) => {
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
app.get('/data/:symbol', (req, res) => {
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

// Serve the HTML file
app.use(express.static(__dirname));
app.get('/historical-stock.html', (req, res) => {
    res.sendFile(__dirname + '/historical-stock.html');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});