import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { adminLteConf } from './admin-lte.conf';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

import { AlertModule as MkAlertModule, BoxModule, LayoutModule } from 'angular-admin-lte';

import { AppComponent } from './app.component';

import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';
import { AddUser, DeleteUser, EditUser, UserComponent } from './user/user.component';
import { AddDeviceComponent, DeviceComponent } from './device/device.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiModule } from '../api';
import { ModalComponent, ModalDirective } from './modal/modal.component';
import { FormsModule } from '@angular/forms';
import { AddSensorComponent, SensorComponent } from './sensor/sensor.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataAnalyseComponent } from './data-analyse/data-analyse.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { AlarmLogComponent } from './alarm-log/alarm-log.component'
import { DataComponent } from './data/data.component';
import { AlarmInfo, LogoutEnsure } from './core/header-inner/header-inner.component';
@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    HttpClientModule,
    LayoutModule.forRoot(adminLteConf),
    LoadingPageModule, MaterialBarModule,
    ApiModule,
    FormsModule,
    MkAlertModule,
    BoxModule,
    ModalModule.forRoot(),
    NgxEchartsModule
  ],
  declarations: [
    AppComponent,
    UserComponent,
    DeviceComponent,
    ModalComponent,
    ModalDirective,
    AddDeviceComponent,
    AddSensorComponent,
    SensorComponent,
    DataAnalyseComponent,
    AlarmLogComponent,
    EditUser,
    AddUser,
    DeleteUser,
    DataComponent,
    LogoutEnsure,
    AlarmInfo
  ],
  entryComponents:[ AddDeviceComponent, AddSensorComponent,EditUser,AddUser,DeleteUser
    ,LogoutEnsure,AlarmInfo],
  bootstrap: [AppComponent]
})
export class AppModule {}
