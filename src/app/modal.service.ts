import { Injectable, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ModalValue } from './modal/modal.component';

export class ShowItem{
  component:Type<ModalValue>;
  callback:(any)=>void;
  params:any;
  constructor(item:Type<any>,params:any,callback:(any)=>void){
    this.component = item;
    this.callback = callback;
    this.params = params;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  show: Observable<ShowItem>;
  private showIn: Subject<ShowItem>;
  constructor() {
    this.showIn = new Subject<ShowItem>();
    this.show = this.showIn.asObservable();
  }

  modal(component:Type<any>,params:any):Promise<any>{
    return new Promise((resolve) => {
      this.showIn.next(new ShowItem(component, params, resolve));
    })
  }
}
