const express = require('express');
const app = express();
const port = 3000;
const mysql = require("mysql");
require("dotenv").config();

// Middleware to parse JSON request bodies
app.use(express.json());

// MySQL connection parameters
const parameters = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
};

// Step 2: establish a connection to the database
const mysqlConnection = mysql.createConnection(parameters);
mysqlConnection.connect((error) => {
    if (error) {
        console.log(error);
    } else {
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

// Function to add a new stock to the database
const addStock = (symbol, callback) => {
    const query = `INSERT INTO stocks (symbol) VALUES ('${symbol}')`;

    mysqlConnection.query(query, (error, results) => {
        if (error) {
            console.error(`Error adding stock ${symbol}:`, error);
            callback(error, null);
        } else {
            console.log(`Stock ${symbol} added successfully`);
            callback(null, results);
        }
    });
};

// API endpoint to add a new stock
app.post('/add-stock', (req, res) => {
    const symbol = req.body.symbol; // Assuming the symbol is sent in the request body

    addStock(symbol, (error, result) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Stock added successfully' });
        }
    });
});

// Function to fetch latest data for a stock from the database
const getLatestData = (symbol, callback) => {
    const query = `
        SELECT 
            Date,
            Close,
            Volume,
            Open,
            High,
            Low,
            (Close - LAG(Close) OVER (ORDER BY Date)) / LAG(Close) OVER (ORDER BY Date) * 100 AS PercentageChange
        FROM 
            ${symbol}
        ORDER BY 
            Date DESC
        LIMIT 1;
    `;

    mysqlConnection.query(query, (error, results) => {
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
app.get('/latest-data/:symbol', (req, res) => {
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


app.get('/historical-stock.html', (req, res) => {
    res.sendFile(__dirname + '/historical-stock.html');
});

app.get('/watchlist.html', (req, res) => {
    res.sendFile(__dirname + '/watchlist.html');
});

// Serve the HTML file
app.use(express.static(__dirname));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});