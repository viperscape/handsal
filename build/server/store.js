"use strict";
exports.__esModule = true;
var Store = /** @class */ (function () {
    function Store() {
        this.store = {};
    }
    /// returns random pin on new insert
    Store.prototype.insert = function (socket) {
        var tries = 0;
        while (tries < 1e4) {
            var r = rand();
            if (!this.store[r]) {
                this.store[r] = [socket];
                return r;
            }
            else {
                tries++;
                console.log('dupe pin:', r);
            }
        }
    };
    /// returns index of other stream socket
    Store.prototype.append = function (pin, socket) {
        if (!this.store[pin]) {
            console.log('no pin:', pin);
        }
        else {
            var r = this.update(pin, socket);
            if (!r) {
                if (this.store[pin].length < 2) {
                    return this.store[pin].push(socket) - 1;
                }
                else {
                    console.log('max conn:', pin);
                }
            }
            else {
                return r;
            }
        }
    };
    Store.prototype.update = function (pin, socket) {
        var num = 0;
        this.store[pin].forEach(function (el) {
            if (el.id == socket.id) {
                el = socket;
                return num;
            }
            num++;
        });
    };
    Store.prototype.has = function (pin) {
        if (this.store[pin]) {
            return true;
        }
        else {
            return false;
        }
    };
    return Store;
}());
exports.Store = Store;
function rand() {
    var high = 1e6;
    var low = 1e5 + 1;
    var r = Math.floor(Math.random() * (high - low) + low);
    return r;
}
