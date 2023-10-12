const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    // Gérez les événements ici (nouvelle connexion, messages, déconnexion, etc.)
});

http.listen(4000, () => {
    console.log('Serveur en écoute sur le port 4000');
});
