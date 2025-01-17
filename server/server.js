const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const RateLimit = require('express-rate-limit');
const app = express();
const port = 3000;

// Konfiguracja bazy danych MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Macierzynka1969!', // zmień na swoje hasło
    database: 'cookies_db' // zmień na swoją nazwę bazy danych
});

db.connect((err) => {
    // Handles connection errors to a database.
    if (err) throw err;
    
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public_html'));
// Set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

// Obsługa ciasteczek
app.post('/set-cookies', limiter, (req, res) => {
    // Handles HTTP POST request to set cookies and insert data into database table.
    const { necessary, analytics, marketing } = req.body;
    res.cookie('necessary', necessary, { maxAge: 1000 * 60 * 60 * 24 * 30 });
    res.cookie('analytics', analytics, { maxAge: 1000 * 60 * 60 * 24 * 30 });
    res.cookie('marketing', marketing, { maxAge: 1000 * 60 * 60 * 24 * 30 });

    const sql = "INSERT INTO cookies (necessary, analytics, marketing) VALUES (?, ?, ?)";
    db.query(sql, [necessary, analytics, marketing], (err, result) => {
        // Executes a database query with callback handling.
        if (err) throw err;
        
    });

    res.sendStatus(200);
});

app.listen(port, () => {
    
});
