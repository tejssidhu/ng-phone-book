import { Component, OnInit } from '@angular/core';
import { IContact, ContactService } from './shared/index';
import { AuthService } from '../user/shared/index';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

@Component({
    moduleId: module.id,
    templateUrl: 'contact-list.component.html'
})

export class ContactListComponent implements OnInit {
    private _deleteComplete = new Subject<string>();
    deleteMessage: string;
    contacts: IContact[];
    deleteMessageType: string;

    constructor(private contactService: ContactService, private authService: AuthService, private modalService: NgbModal) {
    }

    ngOnInit() {
        this.getContacts();

        this._deleteComplete.subscribe((message) => this.deleteMessage = message);
        debounceTime.call(this._deleteComplete, 3000).subscribe(() => this.deleteMessage = null);
    }

    getContacts() {
        const userId = this.authService.getUserId();
        this.contactService.getContacts(userId).subscribe(
            data => this.contacts = data
        );
    }

    deleteConfirmation(content, id: string) {
        this.modalService.open(content).result.then((result) => {
                if (result === 'ok') {
                    this.contactService.deleteContact(id).subscribe(
                        data => {
                            const foundContact = this.contacts.find(contact => contact.id === id);
                            foundContact.deleted = true;

                            this.deleteMessageType = 'success';
                            this._deleteComplete.next(`Contact was deleted`);
                        },
                        error => {
                            this.deleteMessageType = 'warning';
                            this._deleteComplete.next(`Something went wrong`);
                        });
                }
            }
        );
    }
}
