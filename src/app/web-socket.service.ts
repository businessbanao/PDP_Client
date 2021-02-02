import { Injectable } from '@angular/core';
import  io  from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket:any;
  readonly url = "ws://localhost:5000";



  constructor() {
    // this.socket = io(this.url,{

    // });
    // console.log(this.socket,"io")
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
