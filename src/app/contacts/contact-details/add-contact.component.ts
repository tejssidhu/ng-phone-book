import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IContact, ContactService } from '../shared/index';
import { AuthService } from '../../user/index';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

@Component({
    moduleId: module.id,
    templateUrl: 'add-contact.component.html'
})

export class AddContactComponent implements OnInit {
    contact: IContact;
    isNew: boolean;
    private _deleteComplete = new Subject<string>();
    deleteMessage: string;
    deleteMessageType: string;

    constructor(private route: ActivatedRoute,
        private contactService: ContactService,
        private authService: AuthService,
        private router: Router) {

    }

    ngOnInit() {
        this.route.data.forEach((data) => {
            if (data['contact']) {
                this.contact = data['contact'];
                this.isNew = false;
            } else {
                this.contact = <IContact>{ title: '', forename: '', surname: '', email: '', userId: this.authService.getUserId() };
                this.isNew = true;
            }
        });
    }

    saveContact() {
        if (this.isNew) {
            this.contactService.createContact(this.contact).subscribe(
                data => {
                    this.router.navigate(['/contacts/contact', data.id]);
                    this.deleteMessageType = 'success';
                    this._deleteComplete.next(`Contact Saved`);
                },
                error => {
                    this.deleteMessageType = 'warning';
                    this._deleteComplete.next(`Something went wrong`);
                });
        } else {
            this.contactService.updateContact(this.contact).subscribe(
                data => {
                    this.router.navigate(['/contacts/contact', data.id]);
                    this.deleteMessageType = 'success';
                    this._deleteComplete.next(`Contact Updated`);
                },
                error => {
                    this.deleteMessageType = 'warning';
                    this._deleteComplete.next(`Something went wrong`);
                });
        }
    }
}
