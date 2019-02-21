import { Component, OnInit } from '@angular/core';
import { DefaultService } from '../../../api';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { SockJsService } from '../../sock-js.service';


@Component({
  selector: 'app-sidebar-left-inner',
  templateUrl: './sidebar-left-inner.component.html'
})
export class SidebarLeftInnerComponent implements OnInit{
  nickname:string;
  avatar:string;
  constructor(private api:DefaultService,private me:UserService,private route:Router,private sockJs:SockJsService){

  }

  ngOnInit() {
    this.sockJs.init();
    this.api.getUser().subscribe(v => {
      if(v.username==undefined){
        this.route.navigate(['login']);
      }
      switch (v.level) {
        case 0:
          v['levelStr'] = "超级管理员";
          break;
        case 1:
          v['levelStr'] = "普通管理员";
          break;
        case 2:
          v['levelStr'] = "普通用户";
          break;
        default:
          v['levelStr'] = "未知等级:" + v.level;
          break;
      }
      this.me.setMe(v);
      this.nickname = this.me.me.nickname;
      this.avatar = this.me.me.avatar;
    });
    let timer;
    timer = setInterval(()=>{
      this.api.getUser().subscribe(v=>{
        if(v.username==undefined){
          clearInterval(timer);
          this.route.navigate(['login'])
        }
      })
    },60*1000);
  }

}
