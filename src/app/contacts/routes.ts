import {Routes} from '@angular/router';

import { ContactListComponent, ContactDetailComponent, ContactNumberDetailComponent, ContactResolver, ContactNumberResolver, AddContactComponent, AddContactNumberComponent } from './index';

export const contactRoutes: Routes = [
    { path: '', component: ContactListComponent }
    , { path: 'contact/:id', component: ContactDetailComponent, resolve: { contact: ContactResolver } }
    , { path: 'edit', component: AddContactComponent }
    , { path: 'edit/:id', component: AddContactComponent, resolve: { contact: ContactResolver } }
    , { path: 'contact-number/:id', component: ContactNumberDetailComponent, resolve: { contactNumber: ContactNumberResolver } }
    , { path: 'contact-number/edit/:contactId', component: AddContactNumberComponent }
    , { path: 'contact-number/edit/:contactId/:id', component: AddContactNumberComponent, resolve: { contactNumber: ContactNumberResolver } }
];
