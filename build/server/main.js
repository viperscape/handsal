#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var Server = require("./server");
var Storage = require("./store");
var Events = require("events");
var events = new Events();
var store = new Storage.Store();
Server.run(6063, events, store);
