import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', loadChildren: './pages/login/login.module#LoginPageModule'
  },
  {
    path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule'
  },
  {
    path: 'home', canActivate: [AuthGuard], loadChildren: './pages/home/home.module#HomePageModule'
  },
  {
    path: 'list', canActivate: [AuthGuard], loadChildren: './pages/list/list.module#ListPageModule'
  },
  {
    path: 'news-list', canActivate: [AuthGuard], loadChildren: './pages/news-list/news-list.module#NewsListPageModule'
  },
  {
    path: '**', redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
