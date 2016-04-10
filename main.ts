"use strict";

import server = require("./server");
import storage = require('./store');

const emitter = require('events');

var events = new emitter();
var store = new storage.Store();

server.run(6063, events,store);
