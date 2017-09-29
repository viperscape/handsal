"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var server = require("http").Server(app);
var ws = require('socket.io')(server);
var events;
var store;
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + "/build/client/index.html");
});
app.use("/", express.static(process.cwd() + "/build/client/"));
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
    var group_pin;
    socket.on('data', function (data) {
        if (!group_pin)
            group_pin = pin;
        console.log('data:', pin, group_pin, data);
        send_others_data(pin, group_pin, data, store);
    });
    /// on recv of pin, append to pin in data store
    socket.on('pin', function (data) {
        var idx = store.append(data.pin, socket);
        if (!idx) {
            socket.emit('err', { pin: 'no pin' });
        }
        else {
            group_pin = data.pin;
            broadcast(data.pin, { conn: true }, store);
        }
    });
    socket.on('disconnect', function () {
        if (group_pin) {
            broadcast(group_pin, { dead: true }, store);
        }
        else {
            broadcast(pin, { dead: true }, store);
        }
    });
}
function broadcast(pin, data, store) {
    store.store[pin].forEach(function (el) {
        el.emit('bc', data);
    });
}
function send_others_data(my_pin, group_pin, data, store) {
    var my_id = store.store[my_pin][0].id;
    store.store[group_pin].forEach(function (el) {
        if (el.id != my_id) {
            el.emit('data', data);
        }
    });
}
