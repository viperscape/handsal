"use strict";
var Store = (function () {
    function Store() {
        this.store = {};
    }
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
                console.log('dupe pin');
            }
        }
    };
    /// returns index of other stream socket
    Store.prototype.append = function (pin, socket) {
        if (!this.store[pin]) {
            console.log('no pin');
        }
        else if (this.store[pin].length > 1) {
            console.log('max conn');
        }
        else {
            return this.store[pin].push(socket);
        }
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
