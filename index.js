require('dotenv').config();
const express = require('express');
const mysql = require('mysql');

const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors()); // Add cors middleware
const server = http.createServer(app);

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chatv2'
});

connection.connect();

// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST'],
    },
  });

// Add this
app.get('/', (req, res) => {
    res.send('Hello world');
  });

app.get('/sujet', (req, res) => {
    connection.query('SELECT * FROM sujet', (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
});

server.listen(4000, () => {
    console.log('Serveur en écoute sur le port 4000');
});
