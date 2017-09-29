export class Store {
    store = {};
    
    /// returns random pin on new insert
    insert (socket): number {
        let tries = 0;
        while(tries < 1e4) {
            let r = rand();
            if (!this.store[r]) {
                this.store[r] = [socket];
                return r
            }
            else  { tries++; console.log('dupe pin:',r) }
        }
    }
    
    /// returns index of other stream socket
    append (pin, socket): number {
        if (!this.store[pin]) { 
            console.log('no pin:',pin);
        }
        else {
            let r = this.update(pin,socket);
            if (!r) {
                if (this.store[pin].length < 2) {
                    return this.store[pin].push(socket) - 1
                }
                else { console.log('max conn:',pin); }
            }
            else { return r }
        }
    }
    
    update (pin, socket): any { // varying type, number|undefined
        let num = 0;
        
        this.store[pin].forEach(el => {
            if (el.id == socket.id) {
                el = socket;
                return num; 
            }
            
            num++;
        });
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