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
ws.on('connection', function (socket) {
    var pin = store.insert(socket);
    console.log(store.store[pin].length);
    socket.emit('pin', { pin: pin });
    handle(socket, pin);
});
function handle(socket, pin) {
    socket.on('data', function (data) {
        //console.log(data);
    });
    socket.on('pin', function (data) {
        console.log('pin:' + data.pin);
        var idx = store.append(data.pin);
        console.log(store.store[data.pin].length, idx);
    });
}
