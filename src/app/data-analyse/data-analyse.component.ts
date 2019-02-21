import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts'
import { DefaultService, Count, Data, Device, Sensor, Body3 } from '../../api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DeviceDetail } from 'src/api/model/deviceDetail';
import { moduleDef } from '@angular/core/src/view';
@Component({
  selector: 'app-data-analyse',
  templateUrl: './data-analyse.component.html',
  styleUrls: ['./data-analyse.component.css']
})
export class DataAnalyseComponent implements OnInit {
  devices: Device[] = [];
  selectedDevice: Device;
  sensors: Sensor[] = [];
  selectedSensor: Sensor;
  data: Data[] = [];
  curDevicePage: number = 1;
  devicePage: number;
  curSensorPage: number = 1;
  startData: number = 1;
  endData: number = 1;
  sensorPage: number;
  totNum: number;
  options: any;
  options2: any;
  deviceName: string = "";
  sensorName: string = "";
  modalRef: BsModalRef;
  modalRefOuter: BsModalRef;
  label: Array<string> = [];
  ydata: any[] = [];
  ydata2: any[] = [];
  flag: Boolean = false;

  constructor(private api: DefaultService, private modalService: BsModalService) { }

  ngOnInit() {
    this.api.countDevices().subscribe(value => {
      this.devicePage = Math.max(1, Math.floor((value.count + 10 - 1) / 10));
      console.log(this.devicePage);
    })
    this.api.listDevices(0, 10).subscribe((devices: Device[]) => {
      this.devices = [];
      devices.forEach(value => {
        this.devices.push(value);
        console.log(value.deviceId);
      });
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openModalOuter(template: TemplateRef<any>) {
    this.modalRefOuter = this.modalService.show(template);
  }

  onSelect(device: Device): void {
    this.selectedDevice = device;
    this.deviceName = this.selectedDevice.name;
  }

  turnDevicePage() {
    if (this.curDevicePage > this.devicePage || this.curDevicePage <= 0) alert("请输入正确的页码!");
    else {
      this.api.listDevices((this.curDevicePage - 1) * 10, 10).subscribe((devices: Device[]) => {
        this.devices = [];
        devices.forEach(value => {
          this.devices.push(value);
        });
      });
    }
  }

  closeDevice() {
    if (this.deviceName === "") alert("请选择设备!");
    else {
      this.api.countSensors(this.selectedDevice.deviceId).subscribe(value => {
        this.sensorPage = Math.max(1, Math.floor((value.count + 10 - 1) / 10));
        if (value.count === 0) {
          alert("当前所选设备没有传感器,请选择有效设备!");
          this.deviceName = "";
          this.selectedDevice = null;
        }
        else {
          this.api.getSensors(this.selectedDevice.deviceId, 0, 10).subscribe((sensors: Sensor[]) => {
            this.sensors = [];
            sensors.forEach(value => {
              this.sensors.push(value);
            })
          });
          this.modalRef.hide();
        }
      });
    }
  }

  openModalSensor(template: TemplateRef<any>) {
    if (this.deviceName === "") alert("请先选择设备!");
    else this.modalRef = this.modalService.show(template);
  }

  onSelect2(sensor: Sensor): void {
    this.selectedSensor = sensor;
    this.sensorName = this.selectedSensor.name;
  }

  turnSensorPage() {
    if (this.curSensorPage > this.sensorPage || this.curSensorPage <= 0) alert("请输入正确的页码!");
    else {
      this.api.getSensors(this.selectedDevice.deviceId, (this.curSensorPage - 1) * 10, 10).subscribe((sensors: Sensor[]) => {
        this.sensors = [];
        sensors.forEach(value => {
          this.sensors.push(value);
        })
      });
    }
  }

  closeSensor() {
    if (this.sensorName === "") alert("请选择传感器!");
    else {
      this.api.countData(this.selectedDevice.deviceId, this.selectedSensor.id).subscribe(value => {
        this.totNum = value.count;
      })
      this.modalRef.hide();
    }
  }

  submit() {
    if (this.selectedDevice.deviceId != "" && this.sensorName != "") {
      if (this.startData <= this.endData && this.startData > 0 && this.endData <= this.totNum) {
        this.api.listData(this.selectedDevice.deviceId, this.selectedSensor.id, this.startData - 1, this.endData - this.startData + 1).subscribe((data: Data[]) => {
          const X: string[] = [];
          const Y: Number[] = [];
          for (let i = data.length - 1; i >= 0; --i) {
            X.push(data[i].updateTime);
            Y.push((Number)(data[i].data));
          }
          this.label.push(this.deviceName + ":" + this.sensorName);
          this.ydata.push({
            name: this.deviceName + ":" + this.sensorName,
            type: 'bar',
            data: Y,
            animationDelay: function (idx) {
              return idx * 10 + 100;
            }
          });
          this.ydata2.push({
            name: this.deviceName + ":" + this.sensorName,
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: Y
          });
          this.options = {
            legend: {
              data: this.label,
              align: 'left'
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            tooltip: {},
            xAxis: {
              data: X,
              silent: false,
              splitLine: {
                show: false
              }
            },
            yAxis: {
            },
            series: this.ydata,
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
              return idx * 5;
            }
          };
          this.options2 = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            legend: {
              data: this.label
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: X
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: this.ydata2,
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
              return idx * 5;
            }
          };
          this.flag = true;
        });
        this.modalRefOuter.hide();
      }
      else alert("请选择正确的数据范围!");
    }
    else alert("请选择完所有信息!");
  }

  clear() {
    this.label = [];
    this.ydata = [];
    this.ydata2 = [];
    this.flag = false;
  }
}
