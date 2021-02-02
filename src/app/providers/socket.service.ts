
  import { Injectable } from '@angular/core';
  import  io  from 'socket.io-client';
  import { Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class SocketService {
    socket:any;
    readonly url = "ws://localhost:3000";

    public connectionOptions =  {
      "force new connection" : true,
      "reconnectionAttempts": "Infinity",
      "timeout" : 10000,
      "transports" : ["websocket"]
  };

    constructor() {
      // this.socket = io(this.url);
     }


    listen(eventName:string){
      return new Observable((subscriber)=>{
        this.socket.on(eventName , (data)=>{
          subscriber.next(data);
        });
      })
    }

    emit(eventName:string,data:any){
        this.socket.emit(eventName,data);
    }


  }
