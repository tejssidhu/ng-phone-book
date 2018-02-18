import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IContactNumber } from '../shared/index';

@Component({
    moduleId: module.id,
    selector: '[contact-number-thumbnail]',
    templateUrl: 'contact-number-thumbnail.component.html'
})

export class ContactNumberThumbnailComponent implements OnInit {
    @Input() contactNumber: IContactNumber;
    @Output() confirmDelete = new EventEmitter<string>();

    constructor() {

    }

    ngOnInit() {

    }

    deleteConfirm() {
        this.confirmDelete.emit(this.contactNumber.id);
    }
}
