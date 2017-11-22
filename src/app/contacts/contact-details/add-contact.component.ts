import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IContact, ContactService } from '../shared/index';
import { AuthService } from '../../user/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    moduleId: module.id,
    templateUrl: 'add-contact.component.html'
})

export class AddContactComponent implements OnInit {
    contact: IContact;
    isNew: boolean;

    constructor(private route: ActivatedRoute,
        private contactService: ContactService,
        private authService: AuthService,
        private router: Router,
        private _toastr: ToastsManager) {
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
                    this._toastr.success('Contact ' + data.forename + ' ' + data.surname + ' was created.');
                    this.router.navigate(['/contacts/contact', data.id]);
                },
                error => {
                    this._toastr.error('Something went wrong: ' + error);
                });
        } else {
            this.contactService.updateContact(this.contact).subscribe(
                data => {
                    this._toastr.success('Contact ' + data.forename + ' ' + data.surname + ' was updated.');
                    this.router.navigate(['/contacts/contact', data.id]);
                },
                error => {
                    this._toastr.error('Something went wrong: ' + error);
                });
        }
    }
}
