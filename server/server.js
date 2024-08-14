const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
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
    if (err) throw err;
    console.log('Połączono z bazą danych MySQL');
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public_html'));

// Obsługa ciasteczek
app.post('/set-cookies', (req, res) => {
    const { necessary, analytics, marketing } = req.body;
    res.cookie('necessary', necessary, { maxAge: 1000 * 60 * 60 * 24 * 30 });
    res.cookie('analytics', analytics, { maxAge: 1000 * 60 * 60 * 24 * 30 });
    res.cookie('marketing', marketing, { maxAge: 1000 * 60 * 60 * 24 * 30 });

    const sql = `INSERT INTO cookies (necessary, analytics, marketing) VALUES (?, ?, ?)`;
    db.query(sql, [necessary, analytics, marketing], (err, result) => {
        if (err) throw err;
        console.log('Dane ciasteczek zapisane do bazy danych');
    });

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});
