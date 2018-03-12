import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthGuardService } from './common/guards/auth.guard';
import { AuthService } from './common/services/auth.service';
import { UserService } from './user/shared/user-service';
import { ModalComponent } from './shared/modal-component';

import { AppComponent } from './app.component';
import { LoginComponent } from './user/index';
import { NavBarComponent } from './nav/index';
import { AppRoutingModule } from './/app-routing.module';
import { ToastModule} from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserManager, User, Log } from 'oidc-client';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ToastModule.forRoot(),
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    NavBarComponent,
    ModalComponent
  ],
  providers: [
    AuthGuardService,
    AuthService,
    UserService,
    {
      provide: UserManager,
      useFactory: () => new UserManager(environment.oidcConfig)
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
