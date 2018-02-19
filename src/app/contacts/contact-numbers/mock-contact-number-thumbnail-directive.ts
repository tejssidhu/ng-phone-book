import { DebugElement, Component, Directive, Input, Output, EventEmitter } from '@angular/core';
import { IContactNumber } from '../shared/index';

@Directive({
    selector: '[contact-number-thumbnail]'
})

export class MockContactNumberThumbnailDirective {
    @Input() contactNumber: IContactNumber;
    @Output() confirmDelete = new EventEmitter<string>();

    public clickEmitter = new EventEmitter<void>();
}
