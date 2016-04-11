"use strict";

const express = require('express');
var app = express();

var server = require('http').Server(app);
var ws = require('socket.io')(server);

import storage = require('./store');

var events;
var store: storage.Store;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

export function run (port: number, ev, st) {
    server.listen(port);
    events = ev;
    store = st;
    
    return app
}

/// on connection send a random new pin for use
ws.on('connection', function (socket) {
    let pin = store.insert(socket);
    
    socket.emit('pin', { pin: pin });
    handle(socket, pin);
});

function handle (socket, pin: number) {
    socket.on('data', function (data) {
        //console.log(data);
    });
    
    /// on recv of pin, append to pin in data store
    socket.on('pin', function (data) {
        let idx = store.append(data.pin, socket);
        
        if (!idx) {
            socket.emit('err',{pin:'no pin'})
        }
        else {
            broadcast(data.pin,{data:0},store)
        }
    });
    
    socket.on('disconnect', function () {
        console.log('disconnect');
        broadcast(pin,{dead:true},store);
    });
}

function broadcast (pin: number, data, store: storage.Store) {
    store.store[pin].forEach(el => {
        el.emit('bc', data);
    });
}