import { Routes } from '@angular/router';

import {LoginFormComponent} from './shared/components/login-form/login-form.component';
import {FormItemComponent} from './shared/components/form-item/form-item.component';
import {SignupFormComponent} from './shared/components/signupform/signupform.component';
import {authGuard} from './auth.guard';
import {AuthGuard} from '@angular/fire/auth-guard';
import {inject} from '@angular/core';


export const routes: Routes = [

  {path:'login', component:LoginFormComponent},
  {path:'home', component:FormItemComponent,canActivate:[authGuard]},
  {path:'signup',component:SignupFormComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full'}
];
