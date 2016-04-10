"use strict";
var express = require('express');
var app = express();
var server = require('http').Server(app);
var ws = require('socket.io')(server);
var events;
var store;
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
function run(port, ev, st) {
    server.listen(port);
    events = ev;
    store = st;
    return app;
}
exports.run = run;
/// on connection send a random new pin for use
ws.on('connection', function (socket) {
    var pin = store.insert(socket);
    socket.emit('pin', { pin: pin });
    handle(socket, pin);
});
function handle(socket, pin) {
    socket.on('data', function (data) {
        //console.log(data);
    });
    /// on recv of pin, append to pin in data store
    socket.on('pin', function (data) {
        var idx = store.append(data.pin, socket) - 1;
        store.store[data.pin].forEach(function (el) {
            el.emit('bc', { data: 0 });
        });
    });
}
