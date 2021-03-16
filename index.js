// Create express
const express = require('express');
const app = express();
app.use(express.static('public'))
const port = 3000;

// Get routes
require('./routes')(app);

// Start server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})