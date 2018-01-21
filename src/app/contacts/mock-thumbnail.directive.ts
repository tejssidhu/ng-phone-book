import { DebugElement, Component, Directive, Input, Output, EventEmitter } from '@angular/core';
import { IContact } from './shared/index';

@Directive({
    selector: '[contact-thumbnail]'
})

export class MockThumbnailDirective {
    @Input() contact: IContact;
    @Output() confirmDelete = new EventEmitter<string>();

    public clickEmitter = new EventEmitter<void>();
}
