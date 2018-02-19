import { ComponentFixture, TestBed, async, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DebugElement, Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { ContactNumberListComponent, ContactNumberThumbnailComponent } from './index';
import { ContactNumberService, IContact, IContactNumber } from '../index';
import { AuthService } from '../../common/services/auth.service';
import * as myGlobals from '../../shared/globals';
import { MockContactNumberThumbnailDirective } from './mock-contact-number-thumbnail-directive';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal';

describe('ContactNumberListComponent', () => {
    let fixture: ComponentFixture<ContactNumberListComponent>;
    let injector: TestBed;
    let contactNumberServiceGetContactNumbersCalled: Boolean;
    let contactNumberServiceDeleteContactNumberCalled: Boolean;
    let modalServiceOpenCalled: Boolean;
    let modalServiceContent: string;
    let toastrSuccessCalled: Boolean;
    let toastrErrorCalled: Boolean;
    let modalService: NgbModal;
    let contactNumberService: ContactNumberService;
    const store = {};
    const contact1: IContact = { id: 'id1', userId: 'userId1', title: 'title1', forename: 'forename1', surname: 'surname1', email: 'email1', deleted: false };
    const contactNumber1: IContactNumber = { id: 'id1', contactId: 'contactId1', description: 'description1', telephoneNumber: 'telephoneNumber1', deleted: false };
    const contactNumber2: IContactNumber = { id: 'id2', contactId: 'contactId1', description: 'description2', telephoneNumber: 'telephoneNumber2', deleted: false };
    const contactNumbers: IContactNumber[] = [contactNumber1, contactNumber2];

    beforeEach(() => {
        const contactNumberServiceStub = {
            getContactNumbers: function() {
                contactNumberServiceGetContactNumbersCalled = true;

                return Observable.of(contactNumbers);
            },
            deleteContactNumber: function() {
                contactNumberServiceDeleteContactNumberCalled = true;

                return Observable.of('');
            }
        };
        const modalCompStub = {
            open: function(content) {
                modalServiceContent = content;
                modalServiceOpenCalled = true;

                return {
                    result: {
                        then: function() {
                            return 'ok';
                        }
                    }
                };
            }
        };
        const toastrStub = {
            success: function() {
                toastrSuccessCalled = true;
            },
            error: function() {
                toastrErrorCalled = true;
            }
        };

        TestBed.configureTestingModule({
            declarations: [
                ContactNumberListComponent,
                MockContactNumberThumbnailDirective
            ],
            imports: [
                RouterTestingModule
            ],
            providers: [
                {
                    provide: ContactNumberService,
                    useValue: contactNumberServiceStub
                },
                {
                    provide: NgbModal,
                    useValue: modalCompStub
                },
                {
                    provide: ToastsManager,
                    useValue: toastrStub
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ContactNumberListComponent);

        modalService = TestBed.get(NgbModal);
        contactNumberService = TestBed.get(ContactNumberService);

        injector = getTestBed();
    });
    it('should create the app', async(() => {
        const de = fixture.debugElement.componentInstance;
        expect(de).toBeTruthy();
    }));
    describe('#getContactNumbers', () => {
        it(`should call getContactNumbers on contact number service`, fakeAsync(() => {
            const comp = fixture.debugElement.componentInstance;
            comp.contact = contact1;
            comp.getContactNumbers();

            tick();

            fixture.detectChanges();
            expect(contactNumberServiceGetContactNumbersCalled).toEqual(true);
        }));
    });
    describe('page Elements', () => {
        it(`should have a header with Contact Numbers`, async(() => {
            const comp = fixture.debugElement.componentInstance;
            comp.contact = contact1;
            comp.getContactNumbers();
            fixture.detectChanges();
            
            const deEl = fixture.debugElement.query(By.css('h2'));
            const el = deEl.nativeElement;
            expect(el.textContent).toEqual('Contact Numbers');
        }));
        it(`should have a table with Description and Telephone Number header`, async(() => {
            const comp = fixture.debugElement.componentInstance;
            comp.contact = contact1;
            comp.getContactNumbers();
            fixture.detectChanges();
            
            const deEl = fixture.debugElement.queryAll(By.css('.table-responsive th'));
            const numOfEls = deEl.length;
            expect(numOfEls).toEqual(4);
            expect(deEl[0].nativeElement.textContent).toEqual('Description');
            expect(deEl[1].nativeElement.textContent).toEqual('Telephone Number');
        }));
        it(`should have a button with Add New`, async(() => {
            const comp = fixture.debugElement.componentInstance;
            comp.contact = contact1;
            comp.getContactNumbers();
            fixture.detectChanges();

            const deEl = fixture.debugElement.query(By.css('button'));
            const el = deEl.nativeElement;
            expect(el.textContent).toEqual('Add New');
        }));
    });
    describe('#deleteConfirmation', () => {
        it(`should call modal service open`, fakeAsync(() => {
            const comp = fixture.debugElement.componentInstance;
            const content = 'content';
            const id = 'id';
            comp.deleteConfirmation(content, id);

            tick();

            fixture.detectChanges();
            expect(modalServiceOpenCalled).toEqual(true);
            expect(modalServiceContent).toEqual(content);
        }));
        it(`should call modal service open and if ok is returned then deleteContactNumber on contact number service is called`, fakeAsync(() => {
            const comp = fixture.debugElement.componentInstance;
            const content = 'content';
            const id = 'id1';
            const spy = spyOn(modalService, 'open').and.returnValue(
                {
                    result: Promise.resolve('ok')
                }
            );
            contactNumberService.deleteContactNumber = function() {
                contactNumberServiceDeleteContactNumberCalled = true;

                return Observable.of('id1');
            };

            comp.deleteConfirmation(content, id);

            fixture.detectChanges();
            tick();
            fixture.detectChanges();

            expect(contactNumberServiceDeleteContactNumberCalled).toEqual(true);
            expect(contactNumbers.find(contact => contact.id === 'id1').deleted).toEqual(true);
            expect(toastrSuccessCalled).toEqual(true);
        }));
        it(`should call toastr error if delete contact throws exception`, fakeAsync(() => {
            const comp = fixture.debugElement.componentInstance;
            const content = 'content';
            const id = 'id1';
            const spy = spyOn(modalService, 'open').and.returnValue(
                {
                    result: Promise.resolve('ok')
                }
            );
            contactNumberService.deleteContactNumber = function() {
                contactNumberServiceDeleteContactNumberCalled = true;

                return Observable.throw('error occured');
            };

            comp.deleteConfirmation(content, id);

            fixture.detectChanges();
            tick();
            fixture.detectChanges();

            expect(toastrErrorCalled).toEqual(true);
        }));
    });
});
