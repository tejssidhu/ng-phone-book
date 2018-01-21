import { ComponentFixture, TestBed, async, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import { ContactThumbnailComponent, IContact } from './index';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ContactThumbnailComponent', () => {
    let fixture: ComponentFixture<ContactThumbnailComponent>;
    let injector: TestBed;
    let comp: ContactThumbnailComponent;
    const contact1: IContact = { id: 'id1', userId: 'userId1', title: 'title1', forename: 'forename1', surname: 'surname1', email: 'email1', deleted: false };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ContactThumbnailComponent
            ],
            imports: [
                RouterTestingModule
            ],
            providers: [

            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ContactThumbnailComponent);
        comp = fixture.componentInstance;
        comp.contact = contact1;
        injector = getTestBed();
    });
    it('should create the app', async(() => {
        const de = fixture.debugElement.componentInstance;
        expect(de).toBeTruthy();
    }));
    describe('page Elements', () => {
        it(`should have 5 columns with the correct data`, async(() => {
            fixture.detectChanges();
            const deEl = fixture.debugElement.queryAll(By.css('td'));
            const numOfEls = deEl.length;
            expect(numOfEls).toEqual(5);
            expect(deEl[0].nativeElement.textContent).toEqual('title1');
            expect(deEl[1].nativeElement.textContent).toEqual('forename1');
            expect(deEl[2].nativeElement.textContent).toEqual('surname1');
        }));
        it(`should have 2 buttons Edit and Delete`, async(() => {
            fixture.detectChanges();
            const deEl = fixture.debugElement.queryAll(By.css('td button'));
            const numOfEls = deEl.length;
            expect(numOfEls).toEqual(2);
            expect(deEl[0].nativeElement.textContent).toEqual('Edit');
            expect(deEl[1].nativeElement.textContent).toEqual('Delete');
        }));
    });
});
