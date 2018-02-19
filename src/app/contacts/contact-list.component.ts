import { Component, OnInit } from '@angular/core';
import { IContact, ContactService } from './shared/index';
import { AuthService } from '../common/services/auth.service';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    moduleId: module.id,
    templateUrl: 'contact-list.component.html'
})

export class ContactListComponent implements OnInit {
    contacts: IContact[];

    constructor(private contactService: ContactService,
        private authService: AuthService,
        private modalService: NgbModal,
        private _toastr: ToastsManager) {
    }

    ngOnInit() {
        this.getContacts();
    }

    getContacts() {
        this.contactService.getContacts(this.authService.currentUser.profile.sub).subscribe(
            data => this.contacts = data
        );
    }

    deleteConfirmation(content, id: string) {
        this.modalService.open(content).result.then(result => {
                if (result === 'ok') {
                    this.contactService.deleteContact(id).subscribe(
                        data => {
                            const foundContact = this.contacts.find(contact => contact.id === id);
                            foundContact.deleted = true;

                            this._toastr.success('Contact ' + foundContact.forename + ' ' + foundContact.surname + ' was deleted.');
                        },
                        error => {
                            this._toastr.error('Something went wrong: ' + error);
                        });
                }
            }
        );
    }
}
