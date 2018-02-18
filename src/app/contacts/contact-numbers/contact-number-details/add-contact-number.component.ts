import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IContactNumber, ContactNumberService } from '../../shared/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    moduleId: module.id,
    templateUrl: 'add-contact-number.component.html'
})
export class AddContactNumberComponent implements OnInit {
    contactId: string;
    contactNumber: IContactNumber;
    isNew: boolean;

    constructor(private route: ActivatedRoute,
        private contactNumberService: ContactNumberService,
        private router: Router,
        private _toastr: ToastsManager) {
    }

    ngOnInit() {
        this.route.data.forEach((data) => {
            if (data['contactNumber']) {
                this.contactNumber = data['contactNumber'];
                this.isNew = false;
            } else {
                this.contactId = this.route.snapshot.params['contactId'];
                this.contactNumber = <IContactNumber>{ description: '', telephoneNumber: '', contactId: this.contactId };
                this.isNew = true;
            }
        });
    }

    saveContactNumber() {
        if (this.isNew) {
            this.contactNumberService.createContactNumber(this.contactNumber).subscribe(
                data => {
                    this._toastr.success('Contact Number ' + data.description + ' was created.');
                    this.router.navigate(['/contacts/contact-number', data.id]);
                },
                error => {
                    this._toastr.error('Something went wrong: ' + error);
                });
        } else {
            this.contactNumberService.updateContactNumber(this.contactNumber).subscribe(
                data => {
                    this._toastr.success('Contact Number ' + data.description + ' was updated.');
                    this.router.navigate(['/contacts/contact-number', data.id]);
                },
                error => {
                    this._toastr.error('Something went wrong: ' + error);
                });
        }
    }
}
