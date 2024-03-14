const express = require('express');
const app = express();
const port = 3000;
const mysql = require("mysql")
require("dotenv").config()

parameters = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
};

// Step 2: establish a connection to the database
// now we use the methods available from the mysql module
// first invoke the mysql module’s .createConnection method
const mysqlConnection = mysql.createConnection(parameters);
// now invoke the .connect method
mysqlConnection.connect((error) => {
    if (error) {
        console.log(error);
    } else {
    // if successful, write a message to the console
        console.log("Connected to MySQL");
    }
});

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