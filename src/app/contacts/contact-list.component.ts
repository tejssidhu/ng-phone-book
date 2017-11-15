import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { IContact, ContactService } from './shared/index';
import { AuthService } from '../user/shared/index';
import { ModalComponent } from '../shared/modal-component';
import { TOASTR_TOKEN, Toastr } from '../shared/toastr-service';
import { Observable, Subscription } from 'rxjs/RX';

@Component({
    moduleId: module.id,
    templateUrl: 'contact-list.component.html'
})

export class ContactListComponent implements OnInit {
    @ViewChild(ModalComponent) confirmModal: ModalComponent;
    contacts: IContact[];
    private subscription: Subscription;
    private toastr: Toastr;

    constructor(private contactService: ContactService, private authService: AuthService, injector: Injector) {
        this.toastr = injector.get(TOASTR_TOKEN);
    }

    ngOnInit() {
        this.getContacts();
    }

    getContacts() {
        const userId = this.authService.getUserId();
        this.contactService.getContacts(userId).subscribe(
            data => this.contacts = data
        );
    }

    deleteConfirmation(id: string) {
        this.confirmModal.openModal();
        this.subscription = this.confirmModal.observable.subscribe(clicked => {
            if (clicked) {
                this.contactService.deleteContact(id).subscribe(
                    data => {
                        const foundContact = this.contacts.find(contact => contact.id === id);
                        foundContact.deleted = true;

                        this.toastr.success('Contact Deleted');
                    },
                    error => {
                        this.toastr.error('Something went wrong');
                    });
            }
            this.subscription.unsubscribe();
        });
    }
}
