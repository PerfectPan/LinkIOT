import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user/user.component';
import { DeviceComponent } from './device/device.component';
import { SensorComponent } from './sensor/sensor.component';
import { DataAnalyseComponent } from './data-analyse/data-analyse.component';
import { AlarmLogComponent } from './alarm-log/alarm-log.component'
import { DataComponent } from './data/data.component';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'user',
    data: {
      title: '账户管理'
    },
    component: UserComponent
  }, {
    path: 'device',
    data: {
      title: '设备管理'
    },
    component: DeviceComponent
  }, {
    path: 'sensor/:deviceId',
    data: {
      title: '传感器管理'
    },
    component: SensorComponent
  }, {
    path: 'data-analyse',
    data: {
      title: '数据分析'
    },
    component: DataAnalyseComponent
  }, {
    path: 'alarm-log',
    data: {
      title: '报警历史'
    },
    component: AlarmLogComponent
  },{
    path: 'data/:deviceId/:sensorId/:dataType',
    data: {
      title: '查看数据'
    },
    component: DataComponent
  }, {
    path: 'login',
    loadChildren: './login/login.module#LoginModule',
    data: {
      customLayout: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
