var express = require('express')
/**
 * Set all routes
 * @param {express} app 
 */
module.exports = function(app)
{
    // GET
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/view/index.html');
    });
    app.get('/battle', (req, res) => {
        res.sendFile(__dirname + '/public/view/battle.html');
    });

    // POST
}