"use strict";

export class Store {
    store = {};
    constructor () {}
    
    insert (socket): number {
        let tries = 0;
        while(tries < 1e4) {
            let r = rand();
            if (!this.store[r]) { 
                this.store[r] = [socket];
                return r
            }
            else  { tries++; console.log('dupe pin') }
        }
    }
    
    /// returns index of other stream socket
    append (pin, socket): number {
        if (!this.store[pin]) { 
            console.log('no pin');
        }
        else {
            return this.store[pin].push(socket)
        }
    }
    
    has (pin: number): boolean {
        if (this.store[pin]) { return true }
        else { return false }
    }
}

function rand(): number {
    let high = 1e6;
    let low = 1e5 + 1;
    let r = Math.floor(Math.random() * (high - low) + low);
    return r
}