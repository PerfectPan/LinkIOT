import { Injectable } from '@angular/core';
import { User } from '../api';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  me:User;
  constructor() { }

  setMe(me:User){
    this.me = me;
  }

}
