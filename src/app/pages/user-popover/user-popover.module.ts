import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserPopoverPage } from './user-popover.page';

const routes: Routes = [
  {
    path: '',
    component: UserPopoverPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserPopoverPage]
})
export class UserPopoverPageModule {}
