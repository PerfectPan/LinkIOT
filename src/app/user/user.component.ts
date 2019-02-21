import { Component, Input, OnInit } from '@angular/core';
import { Body, DefaultService, User } from '../../api';
import { ModalService } from '../modal.service';
import { ModalValue } from '../modal/modal.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  children:User[] = [];
  page:number = 1;
  limit:number = 15;
  maxPage:number;
  constructor(private api:DefaultService,private modal:ModalService,public user:UserService) { }

  ngOnInit() {
    this.refreshMe();
    this.refreshList();
  }
  refreshList(){
    this.api.countUser().subscribe(value=>{
      this.maxPage = Math.ceil(value.count/this.limit);
    });
    this.api.listUser((this.page-1)*this.limit,this.limit).toPromise().then(value => {
      this.children = [];
      value.forEach(v=>{
        switch (v.level) {
          case 0:
            v['levelStr'] = "超级管理员";break;
          case 1:
            v['levelStr'] = "普通管理员";break;
          case 2:
            v['levelStr'] = "普通用户";break;
          default:
            v['levelStr'] = "未知等级:"+v.level;break;
        }
        this.children.push(v)
      })
    });
  }

  goto(page:string | number){
    this.page = Number(page);
    this.refreshList();
  }

  add(){
    this.modal.modal(AddUser,{'level':this.user.me.level}).then(value=>{
      return this.api.putUser(value).toPromise();
    }).then(status=>{
      if(status.status==1){
        this.refreshList();
      }else{
        alert(status.message);
      }
    })
  }

  editChild(child:User){
   this.modal.modal(EditUser,child).then(value=>{
     return this.api.postUser(value).toPromise();
   }).then(status=>{
     if(status.status==1){
       this.refreshList();
     }else{
       alert(status.message);
     }
   })
  }

  deleteChild(child:User){
    this.modal.modal(DeleteUser,{}).then(value=>{
      return this.api.delUser(child.username).toPromise();
    }).then(status=>{
      if(status.status==1){
        this.refreshList();
      }else{
        alert(status.message);
      }
    })
  }

  refreshMe(){
    this.api.getUser().toPromise().then(v => {
      switch (v.level) {
        case 0:
          v['levelStr'] = "超级管理员";break;
        case 1:
          v['levelStr'] = "普通管理员";break;
        case 2:
          v['levelStr'] = "普通用户";break;
        default:
          v['levelStr'] = "未知等级:"+v.level;break;
      }
      this.user.setMe(v);
    });
  }

  editMe(nickname:string,phone:string){
    this.api.postUser({nickname:nickname,phone:phone}).toPromise().then(value=>{
      if(value.status==1){
        this.refreshMe();
      }else{
        alert(value.message);
      }
    });
  }
}

@Component({
  template: `
    <div class="modal-header">
      添加用户
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="input-username">用户名(邮箱)</label>
        <input id="input-username" type="text" class="form-control" [(ngModel)]="username">
        <label for="input-password">密码</label>
        <input id="input-password" class="form-control" [(ngModel)]="password">
        <label for="input-nickname">昵称</label>
        <input id="input-nickname" class="form-control" [(ngModel)]="nickname">
        <label for="input-level">权限等级</label>
        <select id="input-level" class="form-control" [(ngModel)]="level" [disabled]="params['level']==1">
          <option value="1">二级管理员</option>
          <option value="2">普通用户</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" (click)="finish()">确定</button>
    </div>
  `
})
export class AddUser implements ModalValue {
  @Input() callback: (any) => void;
  @Input() close: () => void;
  @Input() params: any;

  username:string;
  password:string;
  nickname:string;
  level:number = 2;

  onInit() {}

  finish(){
    this.callback({'username':this.username,'password':this.password,'nickname':this.nickname,'level':Number(this.level)});
    this.close();
  }
}


@Component({
  template: `
    <div class="modal-header">
      编辑用户
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="input-username">用户名(邮箱)</label>
        <input id="input-username" type="text" class="form-control" [(ngModel)]="username" disabled>
        <label for="input-password">密码</label>
        <input id="input-password" class="form-control" [(ngModel)]="password">
        <label for="input-nickname">昵称</label>
        <input id="input-nickname" class="form-control" [(ngModel)]="nickname">
        <label for="input-nickname">头像地址</label>
        <input id="input-nickname" class="form-control" [(ngModel)]="avatar">
        <label for="input-nickname">手机号</label>
        <input id="input-nickname" class="form-control" [(ngModel)]="phone">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" (click)="finish()">确定</button>
    </div>
  `
})
export class EditUser implements ModalValue {
  @Input() callback: (any) => void;
  @Input() close: () => void;
  @Input() params: any;
  username:string;
  password:string;
  nickname:string;
  avatar:string;
  phone:string;
  onInit() {
    const user = <User>this.params;
    this.username = user.username;
    this.password = user.password;
    this.nickname = user.nickname;
    this.avatar = user.avatar;
    this.phone = user.phone;
  }

  finish(){
    this.callback({'username':this.username,'password':this.password,'nickname':this.nickname,'avatar':this.avatar,'phone':this.phone});
    this.close();
  }
}

@Component({
  template: `
    <div class="modal-header">
      删除用户
    </div>
    <div class="modal-body">
      <p>确定要删除用户?</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" (click)="finish()">确定</button>
    </div>
  `
})
export class DeleteUser implements ModalValue {
  @Input() callback: (any) => void;
  @Input() close: () => void;
  @Input() params: any;

  onInit() {
  }

  finish(){
    this.callback({});
    this.close();
  }
}
