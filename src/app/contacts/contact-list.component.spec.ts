import { ComponentFixture, TestBed, async, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DebugElement, Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { ContactListComponent, ContactService, IContact, ContactThumbnailComponent } from './index';
import { AuthService } from '../user/index';
import * as myGlobals from '../shared/globals';
import { MockThumbnailDirective } from './mock-thumbnail.directive';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal';

describe('ContactListComponent', () => {
    let fixture: ComponentFixture<ContactListComponent>;
    let injector: TestBed;
    let contactServiceGetContactsCalled: Boolean;
    let contactServicedeleteContactCalled: Boolean;
    let authUserGetUserIdCalled: Boolean;
    let modalServiceOpenCalled: Boolean;
    let modalServiceContent: string;
    let toastrSuccessCalled: Boolean;
    let toastrErrorCalled: Boolean;
    let modalService: NgbModal;
    let contactService: ContactService;
    const store = {};
    const contact1: IContact = { id: 'id1', userId: 'userId1', title: 'title1', forename: 'forename1', surname: 'surname1', email: 'email1', deleted: false };
    const contact2: IContact = { id: 'id2', userId: 'userId2', title: 'title2', forename: 'forename2', surname: 'surname2', email: 'email2', deleted: false };
    const contacts: IContact[] = [contact1, contact2];

    beforeEach(() => {
        const authServiceStub = {
            getUserId: function() {
                authUserGetUserIdCalled = true;
                return 1;
            }
        };
        const contactServiceStub = {
            getContacts: function() {
                contactServiceGetContactsCalled = true;

                return Observable.of(contacts);
            },
            deleteContact: function() {
                contactServicedeleteContactCalled = true;
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
                ContactListComponent,
                MockThumbnailDirective
            ],
            imports: [
                RouterTestingModule
            ],
            providers: [
                {
                    provide: AuthService,
                    useValue: authServiceStub
                },
                {
                    provide: ContactService,
                    useValue: contactServiceStub
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

        fixture = TestBed.createComponent(ContactListComponent);

        modalService = TestBed.get(NgbModal);
        contactService = TestBed.get(ContactService);

        injector = getTestBed();
    });
    it('should create the app', async(() => {
        const de = fixture.debugElement.componentInstance;
        expect(de).toBeTruthy();
    }));
    describe('#getContact', () => {
        it(`should call auth service getUserId and contact service getContacts`, fakeAsync(() => {
            const comp = fixture.debugElement.componentInstance;
            comp.getContacts();
            comp.contacts = contacts;

            tick();

            fixture.detectChanges();
            expect(authUserGetUserIdCalled).toEqual(true);
            expect(contactServiceGetContactsCalled).toEqual(true);
        }));
    });
    describe('page Elements', () => {
        it(`should have a header with My Contacts`, async(() => {
            fixture.detectChanges();
            const deEl = fixture.debugElement.query(By.css('h2'));
            const el = deEl.nativeElement;
            expect(el.textContent).toEqual('My Contacts');
        }));
        it(`should have a table with Title, Forename, Suranme header`, async(() => {
            fixture.detectChanges();
            const deEl = fixture.debugElement.queryAll(By.css('.table-responsive th'));
            const numOfEls = deEl.length;
            expect(numOfEls).toEqual(5);
            expect(deEl[0].nativeElement.textContent).toEqual('Title');
            expect(deEl[1].nativeElement.textContent).toEqual('Forename');
            expect(deEl[2].nativeElement.textContent).toEqual('Surname');
        }));
        it(`should have a button with Add New`, async(() => {
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
        it(`should call modal service open and if ok is returned then deleteContact on contact service is called`, fakeAsync(() => {
            const comp = fixture.debugElement.componentInstance;
            const content = 'content';
            const id = 'id1';
            const spy = spyOn(modalService, 'open').and.returnValue(
                {
                    result: Promise.resolve('ok')
                }
            );
            contactService.deleteContact = function() {
                contactServicedeleteContactCalled = true;

                return Observable.of('id1');
            };

            comp.deleteConfirmation(content, id);

            fixture.detectChanges();
            tick();
            fixture.detectChanges();

            expect(contactServicedeleteContactCalled).toEqual(true);
            expect(contacts.find(contact => contact.id === 'id1').deleted).toEqual(true);
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
            contactService.deleteContact = function() {
                contactServicedeleteContactCalled = true;

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
