import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { DefaultService, Device, Body3 } from '../../api';
import { ModalService } from '../modal.service';
import { ModalValue } from '../modal/modal.component';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DeviceDetail } from 'src/api/model/deviceDetail';
import { toTypeScript } from '@angular/compiler';
@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  devices: Device[] = [];
  pages: string[] = [];
  checked = false;
  totNum = 0;
  curRecordStart = 1;
  curRecordEnd = 1;
  totPage = 1;
  offset = 0;
  limit = 10;
  modalRef: BsModalRef;
  constructor(private api: DefaultService, private modal: ModalService, private router: Router, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.api.countDevices().subscribe((value) => {
      this.totNum = value.count;
      this.totPage = Math.max(1, Math.floor((this.totNum + this.limit - 1) / this.limit));
      this.pages = [];

      this.curRecordStart = this.totNum == 0 ? 0 : this.offset + 1;
      this.curRecordEnd = this.totNum == 0 ? 0 : Math.min(this.offset + this.limit, this.totNum);

      if (this.totPage <= 5) {
        for (let i = 1; i <= this.totPage; ++i) {
          this.pages.push(String(i));
        }
      }
      else {
        let curPage = Math.floor((this.offset + this.limit) / this.limit);
        if (curPage + 1 >= this.totPage) {
          this.pages.push("1");
          this.pages.push("...");
          for (let i = this.totPage - 2; i <= this.totPage; ++i) {
            this.pages.push(String(i));
          }
        }
        else if (curPage + 2 == this.totPage) {
          this.pages.push("1");
          this.pages.push("...");
          for (let i = curPage - 1; i <= curPage + 1; ++i) {
            this.pages.push(String(i));
          }
          this.pages.push(String(this.totPage));
        }
        else if (curPage - 2 == 1) {
          this.pages.push("1");
          for (let i = curPage - 1; i <= curPage + 1; ++i) {
            this.pages.push(String(i));
          }
          this.pages.push("...");
          this.pages.push(String(this.totPage));
        }
        else if (curPage - 1 <= 1) {
          for (let i = 1; i <= 3; ++i) {
            this.pages.push(String(i));
          }
          this.pages.push("...");
          this.pages.push(String(this.totPage));
        }
        else {
          this.pages.push("1");
          this.pages.push("...");
          for (let i = curPage - 1; i <= curPage + 1; ++i) {
            this.pages.push(String(i));
          }
          this.pages.push("...");
          this.pages.push(String(this.totPage));
        }
      }
    });

    this.api.listDevices(this.offset, this.limit).subscribe((devices: Device[]) => {
      this.devices = [];
      devices.forEach(value => {
        value.status = false;
        this.devices.push(value);
      });
    });
  }

  open() {
    this.modal.modal(AddDeviceComponent, (value) => {
      this.api.putDevice(value).subscribe(status => {
        if (status.status == 1) {
          this.refresh()
        } else {
          console.log(status.message)
        }
      })
    });
  }

  delete() {
    for (let entry of this.devices) {
      if (entry.status == true) {
        this.api.deleteDevice(entry.deviceId).subscribe(status => {
          if (status.status == 1) {
            this.refresh()
          } else {
            console.log(status.message)
          }
        })
      }
    }
  }

  edit(d: Device) {
    var x = new ModifiedDeviceComponent(d);
    this.api.postDevice(x).subscribe(status => {
      if (status.status == 1) {
        this.refresh();
      } else {
        console.log(status.message);
      }
    });
    this.modalRef.hide();
  }

  turnPage(pageNumber: string) {
    if (pageNumber != "...") {
      this.offset = (Number(pageNumber) - 1) * this.limit;
      this.refresh();
    }
  }

  gotoSensors(id: string) {
    this.router.navigate(['sensor', id]);
  }

  goToPre() {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.refresh();
    }
  }

  goToNext() {
    if (this.offset + this.limit < this.totNum) {
      this.offset += this.limit;
      this.refresh();
    }
  }

  selectAll() {
    this.devices.forEach(item => {
      item.status = this.checked;
    })
  }

  //ensure all the sensors are checked
  check(flag: Boolean) {
    if (flag == false) this.checked = false;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}

@Component({
  template: `
    <div class="modal-header">
      创建设备
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="input-device-name">设备名称</label>
        <input id="input-device-name" type="text" class="form-control" [(ngModel)]="deviceName">
        <label for="input-device-description">设备描述</label>
        <textarea id="input-device-description" class="form-control" rows="4" [(ngModel)]="deviceDescription"></textarea>
        <label for="input-device-script">绑定脚本</label>
        <textarea id="input-device-script" class="form-control" rows="6" [(ngModel)]="deviceScript"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" (click)="finish()">确定</button>
    </div>
  `
})
export class AddDeviceComponent implements ModalValue {
  @Input() callback: (any) => void;
  @Input() close: () => void;
  @Input() params:any;
  deviceName: string = "";
  deviceDescription: string = "";
  deviceScript: string = "";
  onInit(){}
  finish() {
    this.callback({ 'name': this.deviceName, 'description': this.deviceDescription, 'script': this.deviceScript });
    this.close();
  }
}

export class ModifiedDeviceComponent implements Body3 {
  deviceId: string;
  name?: string;
  description?: string;
  script?: string;

  constructor(d: Device) {
    this.deviceId = d.deviceId;
    this.name = d.name;
    this.description = d.description;
    this.script = d.deviceId;
  }
}
