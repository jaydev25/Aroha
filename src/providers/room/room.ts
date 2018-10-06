import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

export class Room {
    private url = 'http://localhost:5000';
    private socket;    

    constructor() {
        this.socket = io(this.url);
    }

    public hit(message) {
        this.socket.emit('hit', message);
    }

    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('hit', (message) => {
                observer.next(message);
            });
        });
    }
}