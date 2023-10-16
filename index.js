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

app.get('/sujet/:rubriqueId', (req, res) => {
  const rubriqueId = req.params.rubriqueId;
  const sql = 'SELECT * FROM sujet WHERE id_sujet = ?';

  connection.query(sql, [rubriqueId], (error, results, fields) => {
      if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
          throw error;
      }
      res.json(results);
  });
});

app.get('/conv/:rubriqueId', (req, res) => {
  const rubriqueId = req.params.rubriqueId;
  const sql = 'SELECT * FROM conv WHERE id_sujet = ?';

  connection.query(sql, [rubriqueId], (error, results, fields) => {
      if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
          throw error;
      }
      res.json(results);
  });
});

app.get('/message/:id_conv', (req, res) => {
  const id_conv = req.params.id_conv;
  const sql = 'SELECT * FROM message WHERE id_conv = ?';

  connection.query(sql, [id_conv], (error, results, fields) => {
      if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
          throw error;
      }
      res.json(results);
  });
});


io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Lorsqu'un utilisateur rejoint une salle
  socket.on('join_room', (data) => {
      const { sujet, room, title } = data;

      // Enregistrez la connexion de l'utilisateur dans la base de données
      const sql = 'INSERT INTO conv (id_sujet, conv_title) VALUES (?, ?)';
      const values = [sujet, title];
      connection.query(sql, values, (error, results, fields) => {
          if (error) {
              console.error(error);
          } else {
              console.log(`User ${socket.id} joined room ${room}`);
              socket.join(room); // Rejoignez l'utilisateur à la salle
          }
      });
  });

  // Gérez d'autres événements ici (envoi de messages, déconnexion, etc.)
});


server.listen(4000, () => {
    console.log('Serveur en écoute sur le port 4000');
});
