import { ComponentFixture, TestBed, async, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import { AddContactComponent } from './index';
import { IContact, ContactService } from '../index';
import { AuthService } from '../../user/index';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

describe('AddContactComponent', () => {
    let fixture: ComponentFixture<AddContactComponent>;
    let injector: TestBed;
    let comp: AddContactComponent;
    const contact1: IContact = { id: 'id1', userId: 'userId1', title: 'title1', forename: 'forename1', surname: 'surname1', email: 'email1', deleted: false };
    let toastrSuccessCalled: Boolean;
    let toastrErrorCalled: Boolean;
    let contactServiceCreateContactCalled: Boolean;
    let contactServiceUpdateContactCalled: Boolean;
    let authUserGetUserIdCalled: Boolean;
    let navigateCalled: Boolean;
    let activatedRoute: ActivatedRoute;
    let contactService: ContactService;
    let contactToSave: IContact;
    let throwError: Boolean;
    const dataElement: any = {
        title: '',
        forename: '',
        surname: ''
    };

    class MockRouter {
        navigate(path: string) { navigateCalled = true; return path; }
    }

    beforeEach(async(() => {
        const authServiceStub = {
            getUserId: function() {
                authUserGetUserIdCalled = true;
                return '1';
            }
        };
        const contactServiceStub = {
            createContact: function(contact: IContact) {
                contactToSave = contact;
                contactServiceCreateContactCalled = true;

                if (throwError) {
                    return Observable.throw('error occured');
                }
                return {subscribe: () => {} };
            },
            updateContact: function(contact: IContact) {
                contactToSave = contact;
                contactServiceUpdateContactCalled = true;

                if (throwError) {
                    return Observable.throw('error occured');
                }
                return {subscribe: () => {} };
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
        const activatedRouteStub = {
            data: []
        };

        TestBed.configureTestingModule({
            declarations: [
                AddContactComponent
            ],
            imports: [
                RouterTestingModule,
                FormsModule
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
                    provide: ActivatedRoute,
                    useValue: activatedRouteStub
                },
                {
                    provide: ToastsManager,
                    useValue: toastrStub
                },
                {
                    provide: Router,
                    useClass: MockRouter
                }
            ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(AddContactComponent);
        activatedRoute = TestBed.get(ActivatedRoute);
        contactService = TestBed.get(ContactService);

        injector = getTestBed();
    });
    it('should create the app', async(() => {
        const de = fixture.debugElement.componentInstance;
        expect(de).toBeTruthy();
    }));
    describe('page Elements', () => {
        it(`should contain form with correct elements for a new contact`, fakeAsync(() => {
            activatedRoute.data = Observable.of(dataElement);
            comp = fixture.componentInstance;
            comp.isNew = true;

            tick();
            fixture.detectChanges();

            let deEl = fixture.debugElement.query(By.css('input#title'));
            let el = deEl.nativeElement;
            expect(el.textContent).toEqual('');

            deEl = fixture.debugElement.query(By.css('input#forename'));
            el = deEl.nativeElement;
            expect(el.textContent).toEqual('');

            deEl = fixture.debugElement.query(By.css('input#surname'));
            el = deEl.nativeElement;
            expect(el.textContent).toEqual('');

            deEl = fixture.debugElement.query(By.css('input#email'));
            el = deEl.nativeElement;
            expect(el.textContent).toEqual('');

            const deEls = fixture.debugElement.queryAll(By.css('button'));
            el = deEls[0].nativeElement;
            expect(el.textContent).toEqual('Save');
            el = deEls[1].nativeElement;
            expect(el.textContent).toEqual('Cancel');
        }));
        xit(`should contain form with correct elements for an existing contact`, fakeAsync(() => {
            comp = fixture.componentInstance;
            const returnElement = {
                'contact': {
                        title: contact1.title,
                        forename: contact1.forename,
                        surname: contact1.surname,
                        email: contact1.email
                }
            };
            activatedRoute.data = Observable.of(returnElement);
            comp.contact = contact1;

            tick();
            fixture.detectChanges();

            let deEl = fixture.debugElement.query(By.css('input#title'));
            let el = deEl.nativeElement;
            expect(el.textContent).toEqual(contact1.title);

            deEl = fixture.debugElement.query(By.css('input#forename'));
            el = deEl.nativeElement;
            expect(el.textContent).toEqual(contact1.forename);

            deEl = fixture.debugElement.query(By.css('input#surname'));
            el = deEl.nativeElement;
            expect(el.textContent).toEqual(contact1.surname);

            deEl = fixture.debugElement.query(By.css('input#email'));
            el = deEl.nativeElement;
            expect(el.textContent).toEqual(contact1.email);
        }));
    });
    describe('for new contact', () => {
        it(`should have set isNew to true and contact is set correctly`, fakeAsync(() => {
            activatedRoute.data = Observable.of(dataElement);
            comp = fixture.componentInstance;

            tick();
            fixture.detectChanges();

            expect(comp.isNew).toEqual(true);
            expect(comp.contact.title).toEqual('');
            expect(comp.contact.forename).toEqual('');
            expect(comp.contact.surname).toEqual('');
            expect(comp.contact.userId).toEqual('1');
        }));
    });
    describe('for existing contact', () => {
        it(`should have set isNew to false and contact is set correctly`, fakeAsync(() => {
            comp = fixture.componentInstance;
            const returnElement = {
                'contact': {
                        title: 'title',
                        forename: 'forename',
                        surname: 'surname'
                }
            };
            activatedRoute.data = Observable.of(returnElement);

            tick();
            fixture.detectChanges();

            expect(comp.isNew).toEqual(false);
            expect(comp.contact.title).toEqual('title');
            expect(comp.contact.forename).toEqual('forename');
            expect(comp.contact.surname).toEqual('surname');
        }));
    });
    describe('save contact', () => {
        it(`should call createContact with correct data when a new contact is saved`, fakeAsync(() => {
            comp = fixture.componentInstance;
            comp.isNew = true;
            comp.contact = contact1;

            tick();
            fixture.detectChanges();
            comp.saveContact();

            expect(contactServiceCreateContactCalled).toEqual(true);
            expect(contactToSave).toEqual(contact1);
        }));
        it(`should call updateContact when an existing contact is saved`, fakeAsync(() => {
            comp = fixture.componentInstance;
            comp.isNew = false;
            comp.contact = contact1;

            tick();
            fixture.detectChanges();
            comp.saveContact();

            expect(contactServiceUpdateContactCalled).toEqual(true);
            expect(contactToSave).toEqual(contact1);
        }));
        it(`should call toastr success and navigate to the correct page when createContact saves a new contact`, fakeAsync(() => {
            contactService.createContact = function() {
                return Observable.of(contact1);
            };
            comp = fixture.componentInstance;
            comp.isNew = true;
            comp.contact = contact1;

            tick();
            fixture.detectChanges();
            comp.saveContact();

            expect(toastrSuccessCalled).toEqual(true);
            expect(navigateCalled).toEqual(true);
        }));
        it(`should call toastr success and navigate to the correct page when createContact saves an existing contact`, fakeAsync(() => {
            contactService.updateContact = function() {
                return Observable.of(contact1);
            };
            comp = fixture.componentInstance;
            comp.isNew = false;
            comp.contact = contact1;

            tick();
            fixture.detectChanges();
            comp.saveContact();

            expect(toastrSuccessCalled).toEqual(true);
            expect(navigateCalled).toEqual(true);
        }));
        it(`should call toastr error when an error occurs during saving a new contact`, fakeAsync(() => {
            throwError = true;

            comp = fixture.componentInstance;
            comp.isNew = true;
            comp.contact = contact1;

            tick();
            fixture.detectChanges();
            comp.saveContact();

            expect(toastrErrorCalled).toEqual(true);
        }));
        it(`should call toastr error when an error occurs during saving an existing contact`, fakeAsync(() => {
            throwError = true;

            comp = fixture.componentInstance;
            comp.isNew = false;
            comp.contact = contact1;

            tick();
            fixture.detectChanges();
            comp.saveContact();

            expect(toastrErrorCalled).toEqual(true);
        }));
    });
});
