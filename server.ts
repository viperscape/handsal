"use strict";

const express = require('express');
var app = express();

var server = require('http').Server(app);
var ws = require('socket.io')(server);

import storage = require('./store');

var events;
var store;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

export function run (port: number, ev, st) {
    server.listen(port);
    events = ev;
    store = st;
    
    return app
}

ws.on('connection', function (socket) {
    let pin = store.insert(socket);
    console.log(store.store[pin].length);
    
    socket.emit('pin', { pin: pin });
    handle(socket, pin);
});

function handle (socket, pin: number) {
    socket.on('data', function (data) {
        //console.log(data);
    });
    
    socket.on('pin', function (data) {
        console.log('pin:' + data.pin);
        let idx = store.append(data.pin);
        console.log(store.store[data.pin].length, idx);
    });
}