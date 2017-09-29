"use strict";
exports.__esModule = true;
var client_1 = require("./client");
function App(io) {
    return new client_1.Client(io);
}
;
global.window.App = App;
