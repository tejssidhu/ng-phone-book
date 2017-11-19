import {Routes} from '@angular/router';

import { ContactListComponent, ContactDetailComponent, ContactResolver, AddContactComponent } from './index';

export const contactRoutes: Routes = [
    { path: '', component: ContactListComponent }
    , { path: 'contact/:id', component: ContactDetailComponent, resolve: { contact: ContactResolver } }
    , { path: 'edit', component: AddContactComponent }
    , { path: 'edit/:id', component: AddContactComponent, resolve: { contact: ContactResolver } }
];
