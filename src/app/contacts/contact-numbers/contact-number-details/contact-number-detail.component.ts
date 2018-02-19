import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IContactNumber, ContactNumberService } from '../../shared/index';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    moduleId: module.id,
    templateUrl: 'contact-number-detail.component.html'
})

export class ContactNumberDetailComponent implements OnInit {
    contactNumber: IContactNumber;

    constructor(private route: ActivatedRoute,
        private contactNumberService: ContactNumberService,
        private router: Router,
        private modalService: NgbModal,
        private _toastr: ToastsManager) {
    }

    ngOnInit() {
        this.route.data.forEach((data) => {
            this.contactNumber = data['contactNumber'];
        });
    }

    deleteConfirmation(content, id: string) {
        this.modalService.open(content).result.then((result) => {
                if (result === 'ok') {
                    this.contactNumberService.deleteContactNumber(id).subscribe(
                        data => {
                            this.contactNumber.deleted = true;

                            this._toastr.success('Contact ' + this.contactNumber.description + ' was deleted.');

                            this.router.navigate(['/contacts/contact/', this.contactNumber.contactId]);
                        },
                        error => {
                            this._toastr.error('Something went wrong: ' + error);
                        });
                }
            }
        );
    }
}
