"use strict";
var server = require("./server");
var storage = require('./store');
var emitter = require('events');
var events = new emitter();
var store = new storage.Store();
server.run(6063, events, store);
