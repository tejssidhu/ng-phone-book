import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ContactListComponent,
  ContactDetailComponent,
  ContactThumbnailComponent,
  ContactResolver,
  ContactService,
  AddContactComponent
} from './index';

import { contactRoutes } from './routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(contactRoutes),
    NgbModule
  ],
  declarations: [
    ContactListComponent,
    ContactDetailComponent,
    ContactThumbnailComponent,
    AddContactComponent,
  ],
  providers:    [
    ContactResolver,
    ContactService
  ]
})
export class ContactsAppModule { }
