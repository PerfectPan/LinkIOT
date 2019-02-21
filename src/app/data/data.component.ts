import { Component, OnInit } from '@angular/core';
import { Data, DefaultService } from '../../api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  data:Data[] = [];
  page:number = 1;
  limit: number = 15;
  maxPage: number;
  deviceId:string;
  sensorId:number;
  dataType: number;
  constructor(private api:DefaultService,private router:ActivatedRoute) {

  }

  ngOnInit() {
    console.log("Here");
    this.router.params.subscribe(value=>{
      this.deviceId = value['deviceId'];
      this.sensorId = Number(value['sensorId']);
      this.dataType = Number(value['dataType']);
      this.refresh();
    })
  }

  refresh(){
    this.api.countData(this.deviceId,this.sensorId).subscribe(value=>{
      this.maxPage = Math.ceil(value.count/this.limit);
    });
    this.api.listData(this.deviceId,this.sensorId,(this.page-1)*this.limit,this.limit).toPromise().then(value=>{
      this.data = [];
      value.forEach(v=>{
        this.data.push(v);
      })
    })
  }

  goto(page:string | number){
    this.page = Number(page);
    this.refresh();
  }

}
