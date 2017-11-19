import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IContact, ContactService } from '../shared/index';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

@Component({
    moduleId: module.id,
    templateUrl: 'contact-detail.component.html'
})

export class ContactDetailComponent implements OnInit {
    contact: IContact;
    private _deleteComplete = new Subject<string>();
    deleteMessage: string;
    deleteMessageType: string;

    constructor(private route: ActivatedRoute,
        private contactService: ContactService,
        private router: Router,
        private modalService: NgbModal) {

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

                            this.router.navigate(['/contacts']);
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
