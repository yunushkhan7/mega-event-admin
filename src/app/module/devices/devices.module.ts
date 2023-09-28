import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrReadersComponent } from './qr-readers/qr-readers.component';
import { EthernetComponent } from './ethernet/ethernet.component';
import { DoorsComponent } from './doors/doors.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialExModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddAndEditDoorComponent } from './add-and-edit-door/add-and-edit-door.component';
import { AddAndEditEthernetComponent } from './add-and-edit-ethernet/add-and-edit-ethernet.component';
import { AddAndEditQrReaderComponent } from './add-and-edit-qr-reader/add-and-edit-qr-reader.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: "",
    component: EthernetComponent,
    data: { title: 'Ethernet' }
  },
  {
    path: "ethernet",
    component: EthernetComponent,
    data: { title: 'Ethernet' }
  },
  {
    path: "qr-reader",
    component: QrReadersComponent,
    data: { title: 'QrReader' }
  },
  {
    path: "doors",
    component: DoorsComponent,
    data: { title: 'Doors' }
  },


  {
    path: "doors",
    component: DoorsComponent,
    data: { title: 'Doors' }
  },


  {
    path: "doors/add",
    component: AddAndEditDoorComponent,
    data: { title: 'Doors' }
  },

  {
    path: "doors/edit/:id",
    component: AddAndEditDoorComponent,
    data: { title: 'Doors' }
  },

  {
    path: "ethernet/add",
    component: AddAndEditEthernetComponent,
    data: { title: 'Add Ethernet' }
  },

  {
    path: "ethernet/edit/:id",
    component: AddAndEditEthernetComponent,
    data: { title: 'Edit Ethernet' }
  },
  {
    path: "qr-reader/add",
    component: AddAndEditQrReaderComponent,
    data: { title: 'Qr Reader' }
  },
  {
    path: "qr-reader/edit/:id",
    component: AddAndEditQrReaderComponent,
    data: { title: 'Qr Reader' }
  },

]


@NgModule({
  declarations: [
    QrReadersComponent,
    EthernetComponent,
    DoorsComponent,
    AddAndEditDoorComponent,
    AddAndEditEthernetComponent,
    AddAndEditQrReaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialExModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ]
})
export class DevicesModule { }
