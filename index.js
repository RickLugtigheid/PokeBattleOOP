// Create express
const express = require('express');
const app = express();
app.use(express.static('public'))
const port = 3000;

// Start socket server
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Get routes
require('./routes')(app);

// Set socket events
require('./src/userManager').addListners(io);

// Start server
http.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})