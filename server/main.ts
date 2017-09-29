#!/usr/bin/env node

import Server = require("./server");
import Storage = require("./store");

import Events = require("events");

var events = new Events();
var store = new Storage.Store();

Server.run(6063, events,store);
