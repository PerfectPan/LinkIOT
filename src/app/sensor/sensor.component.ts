import { Component, Input, OnInit, TemplateRef} from '@angular/core';
import { DefaultService, Sensor, Body5 } from '../../api';
import { ModalService } from '../modal.service';
import { ModalValue } from '../modal/modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements OnInit {
  sensors:Sensor[] = [];
  deviceId:string = "";
  pages: string[] = [];
  checked = false;
  totNum = 0;
  curRecordStart = 1;
  curRecordEnd = 1;
  totPage = 1;
  offset = 0;
  limit = 10;
  modalRef: BsModalRef;
  constructor(private api:DefaultService,private next:Router, private modal: ModalService,private router:ActivatedRoute,private modalService: BsModalService) { }

  ngOnInit() {
    this.router.params.subscribe(value=>{
      this.deviceId = value['deviceId'];
      this.refresh();
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  refresh(){
    this.api.countSensors(this.deviceId).subscribe((value)=>{
      this.totNum=value.count;
      this.totPage=Math.max(1,Math.floor((this.totNum+this.limit-1)/this.limit));
      this.pages = [];
      
      this.curRecordStart=this.totNum==0?0:this.offset+1;
      this.curRecordEnd=this.totNum==0?0:Math.min(this.offset+this.limit,this.totNum);

      if (this.totPage<=5){
        for (let i=1;i<=this.totPage;++i){
          this.pages.push(String(i));
        }
      }
      else{
        let curPage=Math.floor((this.offset+this.limit)/this.limit);
        if (curPage+1>=this.totPage){
          this.pages.push("1");
          this.pages.push("...");
          for (let i=this.totPage-2;i<=this.totPage;++i){
            this.pages.push(String(i));
          }
        }
        else if (curPage+2==this.totPage){
          this.pages.push("1");
          this.pages.push("...");
          for (let i=curPage-1;i<=curPage+1;++i){
            this.pages.push(String(i));
          }
          this.pages.push(String(this.totPage));
        }
        else if (curPage-2==1){
          this.pages.push("1");
          for (let i=curPage-1;i<=curPage+1;++i){
            this.pages.push(String(i));
          }
          this.pages.push("...");
          this.pages.push(String(this.totPage));
        }
        else if (curPage-1<=1){
          for (let i=1;i<=3;++i){
            this.pages.push(String(i));
          }
          this.pages.push("...");
          this.pages.push(String(this.totPage));
        }
        else{
          this.pages.push("1");
          this.pages.push("...");
          for (let i=curPage-1;i<=curPage+1;++i){
            this.pages.push(String(i));
          }
          this.pages.push("...");
          this.pages.push(String(this.totPage));
        }
      }
    });

    this.api.getSensors(this.deviceId,this.offset,this.limit).subscribe(value=>{
      this.sensors = [];
      value.forEach(v=>{
        v.status = false;
        v.realType=this.getRealType(v.dataType);
        this.sensors.push(v);
      })
    })
  }

  open() {
    this.modal.modal(AddSensorComponent,(value)=>{
      this.api.putSensor(this.deviceId,value).subscribe(status=>{
        console.log(status.status);
        if(status.status==1){
          this.refresh()
        }else{
          console.log(status.message)
        }
      })
    });
  }

  delete(){
    for (let entry of this.sensors){
      if (entry.status==true){
        this.api.deleteSensor(this.deviceId,entry.id).subscribe(status=>{
          if (status.status==1){
            this.refresh()
          }else{
            console.log(status.message)
          }
        })
      }
    }
  }

  getRealType(dataType:number):string{
    if (dataType===0) return "Number";
    else if (dataType===1) return "Text";
    else if (dataType===2) return "Point";
    else if (dataType===3) return "Image";
    else if (dataType===4) return "Boolean";
    else if (dataType===5) return "Object";
  }

  edit(d:Sensor){
    var x=new ModifiedSensorComponent(d);
    this.api.postSensor(this.deviceId,x).subscribe(status=>{
      if (status.status==1){
        this.refresh()
      }else{
        console.log(status.message)
      }
    });
    this.modalRef.hide();
  }

  turnPage(pageNumber:string){
    if (pageNumber!="..."){
      this.offset=(Number(pageNumber)-1)*this.limit;
      this.refresh();
    }
  }

  goToPre(){
    if (this.offset>0){
      this.offset-=this.limit;
      this.refresh();
    }
  }

  goToNext(){
    if (this.offset+this.limit<this.totNum){
      this.offset+=this.limit;
      this.refresh();
    }
  }

  selectAll(){
    this.sensors.forEach(item => {
      item.status = this.checked;
    })
  }

  //ensure all the sensors are checked
  check(flag:Boolean){
    if (flag==false) this.checked=false;
  }

  gotoData(sensor:Sensor){
    this.next.navigate(['data',sensor.deviceId,sensor.id,sensor.dataType])
  }
}

@Component({
  template: `
    <div class="modal-header">
      创建设备
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="input-sensor-name">传感器名称</label>
        <input id="input-sensor-name" type="text" class="form-control" [(ngModel)]="sensorName">
        <label for="input-sensor-dataType">数据类型</label>
        <select id="input-sensor-dataType" class="form-control" [(ngModel)]="sensorDataType">
          <option>Number</option>
          <option>Text</option>
          <option>Point</option>
          <option>Image</option>
          <option>Boolean</option>
          <option>Object</option>
        </select>
        <label for="input-sensor-showType">数据展示方式</label>
        <input id="input-sensor-showType" class="form-control" [(ngModel)]="sensorShowType">
        <label for="input-sensor-description">传感器描述</label>
        <textarea id="input-sensor-description" class="form-control" rows="6" [(ngModel)]="sensorDescription"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" (click)="finish()">确定</button>
    </div>
  `
})
export class AddSensorComponent implements ModalValue{
  @Input() callback: (any) => void;
  @Input() close: ()=>void;
  @Input() params:any;
  sensorName:string="";
  sensorDataType:string="";
  sensorShowType:string = "";
  sensorDescription:string = "";

  onInit(){}

  get(dataType:string):number{
    if (dataType==="Number") return 0;
    else if (dataType==="Text") return 1;
    else if (dataType==="Point") return 2;
    else if (dataType==="Image") return 3;
    else if (dataType==="Boolean") return 4;
    else if (dataType==="Object") return 5;
  }

  finish(){
    this.callback({'name':this.sensorName,'dataType':this.get(this.sensorDataType),
    'showType':this.sensorShowType,'description':this.sensorDescription});
    this.close();
  }
}

export class ModifiedSensorComponent implements Body5{
  sensorId: number;
  name: string;
  dataType: number;
  showType: string;
  description: string;

  constructor(d:Sensor){
    this.sensorId=d.id;
    this.name=d.name;
    this.dataType=this.get(d.realType);
    this.showType=d.showType;
    this.description=d.description;
  }

  get(dataType:string):number{
    if (dataType==="Number") return 0;
    else if (dataType==="Text") return 1;
    else if (dataType==="Point") return 2;
    else if (dataType==="Image") return 3;
    else if (dataType==="Boolean") return 4;
    else if (dataType==="Object") return 5;
  }
}
