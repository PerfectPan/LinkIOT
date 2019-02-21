import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

declare let SockJS:any;

export class Message {
  device:{id:string,name:string};
  data:any;
  action:string;
  level?:number;
}

@Injectable({
  providedIn: 'root'
})
export class SockJsService {
  message: Observable<Message>;
  private messageIn:Subject<Message>;
  constructor() {
    this.messageIn = new Subject<Message>();
    this.message = this.messageIn.asObservable();
  }

  init(){
    const sock = new SockJS('http://link.hdussta.cn:7778/v1/sock');
    sock.onopen = function() {
      console.log('SockJs Open');
    };

    sock.onmessage = (e)=>{
      if(e.data!="OK")
        this.messageIn.next(JSON.parse(e.data));
      console.log(e.data);
    };

    sock.onclose = function() {
      console.log('SockJs Close');
    };
  }
}
