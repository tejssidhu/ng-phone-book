import { ComponentFixture, TestBed, async, fakeAsync, tick, getTestBed, inject } from '@angular/core/testing';
import { AddContactNumberComponent } from './index';
import { IContactNumber, ContactNumberService } from '../../index';
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

describe('AddContactNumberComponent', () => {
    let fixture: ComponentFixture<AddContactNumberComponent>;
    let injector: TestBed;
    let comp: AddContactNumberComponent;
    const contactNumber1: IContactNumber = { id: 'id1', contactId: 'contactId1', description: 'description1', telephoneNumber: 'telephoneNumber1', deleted: false };
    let toastrSuccessCalled: Boolean;
    let toastrErrorCalled: Boolean;
    let contactNumberServiceCreateContactNumberCalled: Boolean;
    let contactNumberServiceUpdateContactNumberCalled: Boolean;
    let navigateCalled: Boolean;
    let activatedRoute: ActivatedRoute;
    let contactNumberService: ContactNumberService;
    let contactToSave: IContactNumber;
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
            currentUser: {
                profile: {
                    sub: '1'
                }
            }
        };
        const contactServiceStub = {
            createContactNumber: function(contact: IContactNumber) {
                contactToSave = contact;
                contactNumberServiceCreateContactNumberCalled = true;

                if (throwError) {
                    return Observable.throw('error occured');
                }
                return {subscribe: () => {} };
            },
            updateContactNumber: function(contact: IContactNumber) {
                contactToSave = contact;
                contactNumberServiceUpdateContactNumberCalled = true;

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
            data: [],
            snapshot: {
                params: []
            }
        };

        TestBed.configureTestingModule({
            declarations: [
                AddContactNumberComponent
            ],
            imports: [
                RouterTestingModule,
                FormsModule
            ],
            providers: [
                {
                    provide: ContactNumberService,
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
        fixture = TestBed.createComponent(AddContactNumberComponent);
        activatedRoute = TestBed.get(ActivatedRoute);
        contactNumberService = TestBed.get(ContactNumberService);

        injector = getTestBed();
    });
    it('should create the app', async(() => {
        const de = fixture.debugElement.componentInstance;
        expect(de).toBeTruthy();
    }));
    describe('page Elements', () => {
        it(`should contain form with correct elements for a new contact number`, fakeAsync(() => {
            activatedRoute.data = Observable.of(dataElement);
            comp = fixture.componentInstance;
            comp.isNew = true;

            tick();
            fixture.detectChanges();

            let deEl = fixture.debugElement.query(By.css('input#description'));
            let el = deEl.nativeElement;
            expect(el.value).toEqual('');

            deEl = fixture.debugElement.query(By.css('input#telephoneNumber'));
            el = deEl.nativeElement;
            expect(el.value).toEqual('');

            const deEls = fixture.debugElement.queryAll(By.css('button'));
            el = deEls[0].nativeElement;
            expect(el.textContent).toEqual('Save');
            el = deEls[1].nativeElement;
            expect(el.textContent).toEqual('Cancel');
        }));
        it(`should contain form with correct elements for an existing contact number`, fakeAsync(() => {
            comp = fixture.componentInstance;
            const returnElement = {
                'contactNumber': {
                        description: contactNumber1.description,
                        telephoneNumber: contactNumber1.telephoneNumber
                }
            };
            activatedRoute.data = Observable.of(returnElement);

            fixture.detectChanges();
            tick();
            fixture.detectChanges();

            let deEl = fixture.debugElement.query(By.css('input#description'));
            let el = deEl.nativeElement;
            expect(el.value).toEqual(contactNumber1.description);

            deEl = fixture.debugElement.query(By.css('input#telephoneNumber'));
            el = deEl.nativeElement;
            expect(el.value).toEqual(contactNumber1.telephoneNumber);
        }));
    });
    describe('for new contact number', () => {
        it(`should have set isNew to true and contact number is set correctly`, fakeAsync(() => {
            activatedRoute.data = Observable.of(dataElement);
            comp = fixture.componentInstance;

            tick();
            fixture.detectChanges();

            expect(comp.isNew).toEqual(true);
            expect(comp.contactNumber.description).toEqual('');
            expect(comp.contactNumber.telephoneNumber).toEqual('');
        }));
    });
    describe('for existing contact', () => {
        it(`should have set isNew to false and contact number is set correctly`, fakeAsync(() => {
            comp = fixture.componentInstance;
            const returnElement = {
                'contactNumber': {
                    description: 'descriptionExisting',
                    telephoneNumber: 'telephoneNumberExisting'
                }
            };
            activatedRoute.data = Observable.of(returnElement);

            tick();
            fixture.detectChanges();

            expect(comp.isNew).toEqual(false);
            expect(comp.contactNumber.description).toEqual('descriptionExisting');
            expect(comp.contactNumber.telephoneNumber).toEqual('telephoneNumberExisting');
        }));
    });
    describe('save contact', () => {
        it(`should call createContactNumber with correct data when a new contact number is saved`, fakeAsync(() => {
            comp = fixture.componentInstance;
            comp.isNew = true;
            comp.contactNumber = contactNumber1;

            tick();
            fixture.detectChanges();
            comp.saveContactNumber();

            expect(contactNumberServiceCreateContactNumberCalled).toEqual(true);
            expect(contactToSave).toEqual(contactNumber1);
        }));
        it(`should call updateContactNumber when an existing contact number is saved`, fakeAsync(() => {
            comp = fixture.componentInstance;
            comp.isNew = false;
            comp.contactNumber = contactNumber1;

            tick();
            fixture.detectChanges();
            comp.saveContactNumber();

            expect(contactNumberServiceUpdateContactNumberCalled).toEqual(true);
            expect(contactToSave).toEqual(contactNumber1);
        }));
        it(`should call toastr success and router navigate when createContactNumber saves a new contact number`, fakeAsync(() => {
            contactNumberService.createContactNumber = function() {
                return Observable.of(contactNumber1);
            };
            comp = fixture.componentInstance;
            comp.isNew = true;
            comp.contactNumber = contactNumber1;

            tick();
            fixture.detectChanges();
            comp.saveContactNumber();

            expect(toastrSuccessCalled).toEqual(true);
            expect(navigateCalled).toEqual(true);
        }));
        it(`should call toastr success and router navigate when createContactNumber saves an existing contact number`, fakeAsync(() => {
            contactNumberService.updateContactNumber = function() {
                return Observable.of(contactNumber1);
            };
            comp = fixture.componentInstance;
            comp.isNew = false;
            comp.contactNumber = contactNumber1;

            tick();
            fixture.detectChanges();
            comp.saveContactNumber();

            expect(toastrSuccessCalled).toEqual(true);
            expect(navigateCalled).toEqual(true);
        }));
        it('should navigate to contact number route when saving a new contact number', inject([Router], (router: Router) => {
            const spy = spyOn(router, 'navigate');
            contactNumberService.createContactNumber = function() {
                return Observable.of(contactNumber1);
            };
            comp = fixture.componentInstance;
            comp.isNew = true;
            comp.contactNumber = contactNumber1;

            fixture.detectChanges();
            comp.saveContactNumber();

            const navArgs = spy.calls.first().args[0];

            expect(navArgs[0]).toBe('/contacts/contact-number', 'should nav to contact number detail component');
            expect(navArgs[1]).toBe(contactNumber1.id, 'should nav to contact number detail component with correct id');
        }));
        it('should navigate to contacts route when saving an existing contact', inject([Router], (router: Router) => {
            const spy = spyOn(router, 'navigate');
            contactNumberService.updateContactNumber = function() {
                return Observable.of(contactNumber1);
            };
            comp = fixture.componentInstance;
            comp.isNew = false;
            comp.contactNumber = contactNumber1;

            fixture.detectChanges();
            comp.saveContactNumber();

            const navArgs = spy.calls.first().args[0];

            expect(navArgs[0]).toBe('/contacts/contact-number', 'should nav to contact number detail component');
            expect(navArgs[1]).toBe(contactNumber1.id, 'should nav to contact number detail component with correct id');
        }));
        it(`should call toastr error when an error occurs during saving a new contact number`, fakeAsync(() => {
            throwError = true;

            comp = fixture.componentInstance;
            comp.isNew = true;
            comp.contactNumber = contactNumber1;

            tick();
            fixture.detectChanges();
            comp.saveContactNumber();

            expect(toastrErrorCalled).toEqual(true);
        }));
        it(`should call toastr error when an error occurs during saving an existing contact number`, fakeAsync(() => {
            throwError = true;

            comp = fixture.componentInstance;
            comp.isNew = false;
            comp.contactNumber = contactNumber1;

            tick();
            fixture.detectChanges();
            comp.saveContactNumber();

            expect(toastrErrorCalled).toEqual(true);
        }));
    });
});
