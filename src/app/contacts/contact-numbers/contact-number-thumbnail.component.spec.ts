import { ComponentFixture, TestBed, async, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import { ContactNumberThumbnailComponent } from './index';
import { IContactNumber } from '../index';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ContactThumbnailComponent', () => {
    let fixture: ComponentFixture<ContactNumberThumbnailComponent>;
    let injector: TestBed;
    let comp: ContactNumberThumbnailComponent;
    const contactNumber1: IContactNumber = { id: 'id1', contactId: 'contactId1', description: 'description1', telephoneNumber: 'telephoneNumber1', deleted: false };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ContactNumberThumbnailComponent
            ],
            imports: [
                RouterTestingModule
            ],
            providers: [

            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ContactNumberThumbnailComponent);
        comp = fixture.componentInstance;
        comp.contactNumber = contactNumber1;
        injector = getTestBed();
        fixture.detectChanges();
    });
    it('should create the app', async(() => {
        const de = fixture.debugElement.componentInstance;
        expect(de).toBeTruthy();
    }));
    describe('page Elements', () => {
        it(`should have 4 columns with the correct data`, async(() => {
            const deEl = fixture.debugElement.queryAll(By.css('td'));
            const numOfEls = deEl.length;
            expect(numOfEls).toEqual(4);
            expect(deEl[0].nativeElement.textContent).toEqual('description1');
            expect(deEl[1].nativeElement.textContent).toEqual('telephoneNumber1');
        }));
        it(`should have 2 buttons Edit and Delete`, async(() => {
            const deEl = fixture.debugElement.queryAll(By.css('td button'));
            const numOfEls = deEl.length;
            expect(numOfEls).toEqual(2);
            expect(deEl[0].nativeElement.textContent).toEqual('Edit');
            expect(deEl[1].nativeElement.textContent).toEqual('Delete');
        }));
    });
    describe('deleteConfirmation', () => {
        it(`should raise delete confirmation event when delete is clicked`, async(() => {
            let receivedResponse: string;
            comp.confirmDelete.subscribe((response: string) => receivedResponse = response);

            const deEl = fixture.debugElement.queryAll(By.css('td button'));
            expect(deEl[1].nativeElement.textContent).toEqual('Delete');
            const deleteBtn = deEl[1];

            deleteBtn.triggerEventHandler('click', null);
            expect(receivedResponse).toBe(contactNumber1.id);
        }));
    });
});
