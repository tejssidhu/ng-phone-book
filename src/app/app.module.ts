import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent, AuthService } from './user/index';
import { NavBarComponent } from './nav/index';
import { AppRoutingModule } from './/app-routing.module';

import { TOASTR_TOKEN, Toastr } from './shared/toastr-service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

declare let toastr: Toastr;

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    NavBarComponent
  ],
  providers: [
    AuthService,
    {
        provide: TOASTR_TOKEN,
        useValue: toastr
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
