import express = require("express");
const app = express();

const server = require("http").Server(app);
const ws = require('socket.io')(server);

import storage = require('./store');

var events;
var store: storage.Store;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.use("/public", express.static(__dirname + '/client/public'));

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
    let group_pin;
    
    socket.on('data', function (data) {
        if (!group_pin) group_pin = pin;
    
        console.log('data:',pin,group_pin,data);
        send_others_data(pin,group_pin,data,store);
    });
    
    /// on recv of pin, append to pin in data store
    socket.on('pin', function (data) {
        let idx = store.append(data.pin, socket);
        
        if (!idx) {
            socket.emit('err',{pin:'no pin'})
        }
        else {
            group_pin = data.pin;
            broadcast(data.pin,{conn:true},store)
        }
    });
    
    socket.on('disconnect', function () {
        if (group_pin) { broadcast(group_pin, { dead: true }, store); }
        else { broadcast(pin, { dead: true }, store); }
    });
}

function broadcast (pin: number, data, store: storage.Store) {
    store.store[pin].forEach(el => {
        el.emit('bc', data);
    });
}

function send_others_data (my_pin: number, group_pin: number, data, store: storage.Store) {
    let my_id = store.store[my_pin][0].id;
    store.store[group_pin].forEach(el => {
        if (el.id != my_id) {
            el.emit('data', data);
        }
    });
}