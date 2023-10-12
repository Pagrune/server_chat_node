const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    // Gérez les événements ici (nouvelle connexion, messages, déconnexion, etc.)
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chatv2'
  });
  
  connection.connect();

// Add this
app.get('/', (req, res) => {
    res.send('Hello world');
  });

app.get('/data', (req, res) => {
    connection.query('SELECT * FROM table_name', (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
});

http.listen(4000, () => {
    console.log('Serveur en écoute sur le port 4000');
});
