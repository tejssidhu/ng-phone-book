import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/index';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'contacts', loadChildren: './contacts/contact.app.module#ContactsAppModule'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
