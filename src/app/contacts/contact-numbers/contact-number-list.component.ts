import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IContact, ContactNumberService, IContactNumber } from '../shared/index';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    moduleId: module.id,
    selector: 'contact-number-list',
    templateUrl: 'contact-number-list.component.html'
})

export class ContactNumberListComponent implements OnInit {
    @Input() contact: IContact;
    @Output() confirmDelete = new EventEmitter<string>();
    contactNumbers: IContactNumber[];

    constructor(private contactNumberService: ContactNumberService,
        private modalService: NgbModal,
        private _toastr: ToastsManager) {
    }

    ngOnInit() {
        this.getContactNumbers();
    }

    getContactNumbers() {
        this.contactNumberService.getContactNumbers(this.contact.id).subscribe(
            data => this.contactNumbers = data
        );
    }

    deleteConfirmation(content, id: string) {
        this.modalService.open(content).result.then(result => {
                if (result === 'ok') {
                    this.contactNumberService.deleteContactNumber(id).subscribe(
                        data => {
                            const foundContactNumber = this.contactNumbers.find(contactNumber => contactNumber.id === id);
                            foundContactNumber.deleted = true;

                            this._toastr.success('Contact Number ' + foundContactNumber.description + ' was deleted.');
                        },
                        error => {
                            this._toastr.error('Something went wrong: ' + error);
                        });
                }
            }
        );
    }
}
