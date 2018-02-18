import { DebugElement, Component, Directive, Input, Output, EventEmitter } from '@angular/core';
import { IContact } from '../shared/index';

@Component({
    selector: 'contact-number-list',
    template: ``
})
export class MockContactNumberListComponent {
    @Input() contact: IContact;
    @Output() confirmDelete = new EventEmitter<string>();

    public clickEmitter = new EventEmitter<void>();
}
