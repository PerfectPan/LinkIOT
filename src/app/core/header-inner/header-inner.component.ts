import { Component, Input, NgZone } from '@angular/core';
import { DefaultService } from '../../../api';
import { Router } from '@angular/router';
import { ModalService } from '../../modal.service';
import { ModalValue } from '../../modal/modal.component';
import { SockJsService } from '../../sock-js.service';

@Component({
  selector: 'app-header-inner',
  templateUrl: './header-inner.component.html'
})
export class HeaderInnerComponent {
  alarms: { device: { id: string, name: string }, date: string, level: number, data: any }[] = [];

  constructor(private api: DefaultService, private router: Router, private modal: ModalService, private sockJs: SockJsService, private ngZone: NgZone) {
    this.sockJs.message.subscribe(m => {
      switch (m.action) {
        case 'data':

          break;
        case 'alarm':
          this.ngZone.run(() => {
            this.alarms.push({
              data: m.data,
              device: {id: m.device.id, name: m.device.name},
              level: m.level,
              date: new Date().toISOString()
            });
            if (m.level == 1) {
              this.modal.modal(AlarmInfo,{
                date: new Date().toISOString()
                , level: m.level
                , device: m.device.id + '/' + m.device.name
                , data: JSON.stringify(m.data)
              })
            }
          });
          break;
      }
    });
  }

  remove(i: number) {
    this.modal.modal(AlarmInfo, {
      date: this.alarms[i].date
      , level: this.alarms[i].level
      , device: this.alarms[i].device.id + '/' + this.alarms[i].device.name
      , data: JSON.stringify(this.alarms[i].data)
    }).then(() => {
      this.alarms.splice(i, 1);
    });
  }

  logout() {
    this.modal.modal(LogoutEnsure, {}).then(() => {
      this.api.getLogout().subscribe(()=>{
        this.router.navigate(['/']);
      });
    });
  }
}

@Component({
  template: `
    <div class="modal-header">
      登出确认
    </div>
    <div class="modal-body">
      <p>是否要退出当前账号</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" (click)="finish()">确定</button>
    </div>
  `
})
export class LogoutEnsure implements ModalValue {
  @Input() callback: (any) => void;
  @Input() close: () => void;
  @Input() params: any;

  onInit() {
  }

  finish() {
    this.callback({});
    this.close();
  }
}

@Component({
  template: `
    <div class="modal-header">
      警报
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="input-date">日期</label>
        <input id="input-date" type="text" class="form-control" [(ngModel)]="date" disabled>
        <label for="input-device">设备ID/设备名称</label>
        <input id="input-device" type="text" class="form-control" [(ngModel)]="device" disabled>
        <label for="input-device">等级</label>
        <input id="input-device" type="text" class="form-control" [(ngModel)]="level" disabled>
        <label for="input-data">本次数据</label>
        <input id="input-data" type="text" class="form-control" [(ngModel)]="data" disabled>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" (click)="finish()">确定</button>
    </div>
  `
})
export class AlarmInfo implements ModalValue {
  @Input() callback: (any) => void;
  @Input() close: () => void;
  @Input() params: any;

  date: string;
  device: string;
  data: string;
  level: string;

  onInit() {
    this.date = this.params['date'];
    this.device = this.params['device'];
    this.data = this.params['data'];
    this.level = this.params['level'] == 0 ? '警告' : '严重';
  }

  finish() {
    this.close();
    this.callback({});
  }

}
