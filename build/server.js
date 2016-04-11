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
        var idx = store.append(data.pin, socket);
        if (!idx) {
            socket.emit('err', { pin: 'no pin' });
        }
        else {
            broadcast(data.pin, { conn: true }, store);
        }
    });
    socket.on('disconnect', function () {
        console.log('disconnect');
        broadcast(pin, { dead: true }, store);
    });
}
function broadcast(pin, data, store) {
    store.store[pin].forEach(function (el) {
        el.emit('bc', data);
    });
}
