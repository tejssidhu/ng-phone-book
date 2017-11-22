import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IContact, ContactService } from '../shared/index';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    moduleId: module.id,
    templateUrl: 'contact-detail.component.html'
})

export class ContactDetailComponent implements OnInit {
    contact: IContact;

    constructor(private route: ActivatedRoute,
        private contactService: ContactService,
        private router: Router,
        private modalService: NgbModal,
        private _toastr: ToastsManager) {
    }

    ngOnInit() {
        this.route.data.forEach((data) => {
            this.contact = data['contact'];
        });
    }

    deleteConfirmation(content, id: string) {
        this.modalService.open(content).result.then((result) => {
                if (result === 'ok') {
                    this.contactService.deleteContact(id).subscribe(
                        data => {
                            this.contact.deleted = true;

                            this._toastr.success('Contact ' + this.contact.forename + ' ' + this.contact.surname + ' was deleted.');

                            this.router.navigate(['/contacts']);
                        },
                        error => {
                            this._toastr.error('Something went wrong: ' + error);
                        });
                }
            }
        );
    }
}
