import { Component, OnInit, TemplateRef } from '@angular/core';
import { DefaultService, AlarmLog, Body6 } from '../../api';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Body } from '@angular/http/src/body';
@Component({
  selector: 'app-alarm-log',
  templateUrl: './alarm-log.component.html',
  styleUrls: ['./alarm-log.component.css']
})
export class AlarmLogComponent implements OnInit {
  alarmLogs: AlarmLog[] = [];
  pages: string[] = [];
  checked = false;
  totNum = 0;
  curRecordStart = 1;
  curRecordEnd = 1;
  totPage = 1;
  offset = 0;
  limit = 10;
  modalRef: BsModalRef;
  constructor(private api: DefaultService, private router: Router, private modalService: BsModalService) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.api.countAlarmLogs().subscribe((value) => {
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

    this.api.getAlarmLogs(this.offset, this.limit).subscribe((alarmLogs: AlarmLog[]) => {
      this.alarmLogs = [];
      alarmLogs.forEach(value => {
        value.status = false;
        this.alarmLogs.push(value);
        console.log(value);
      });
    });
  }

  delete() {
    for (let entry of this.alarmLogs) {
      if (entry.status == true) {
        this.api.deleteAlarmLog(entry.id).subscribe(status => {
          if (status.status == 1) {
            this.refresh();
          } else {
            console.log(status.message);
          }
        })
      }
    }
  }

  turnPage(pageNumber: string) {
    if (pageNumber != "...") {
      this.offset = (Number(pageNumber) - 1) * this.limit;
      this.refresh();
    }
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
    this.alarmLogs.forEach(item => {
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

  submit(alarmLog: AlarmLog) {
    if (alarmLog.handle === "") alert("请不要输入空白信息!");
    else {
      var log = new alarmHandle(alarmLog);
      this.api.postAlarmLog(log).subscribe(status => {
        if (status.status == 1) {
          this.refresh();
        } else {
          console.log(status.message);
        }
      })
      this.modalRef.hide();
    }
  }
}

export class alarmHandle implements Body6 {
  logId: number;
  handle: string;

  constructor(alarm: AlarmLog) {
    this.logId = alarm.id;
    this.handle = alarm.handle;
  }
}