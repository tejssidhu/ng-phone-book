import { ComponentFixture, TestBed, async, fakeAsync, tick, getTestBed } from '@angular/core/testing';
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
import { ContactDetailComponent } from './index';
import { IContact, ContactService, ContactNumberListComponent } from '../index';
import { MockContactNumberListComponent } from '../contact-numbers/mock-contact-number-list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('ContactDetailComponent', () => {
    let fixture: ComponentFixture<ContactDetailComponent>;
    let injector: TestBed;
    let comp: ContactDetailComponent;
    const contact1: IContact = { id: 'id1', userId: 'userId1', title: 'title1', forename: 'forename1', surname: 'surname1', email: 'email1', deleted: false };
    let toastrSuccessCalled: Boolean;
    let toastrErrorCalled: Boolean;
    let contactServiceDeleteContactCalled: Boolean;
    let modalServiceOpenCalled: Boolean;
    let modalServiceContent: string;
    let navigateCalled: Boolean;
    let activatedRoute: ActivatedRoute;
    let contactService: ContactService;
    let contactIdToDelete: string;
    let throwError: Boolean;
    let modalService: NgbModal;

    const dataElement: any = {
        'contact': contact1
    };

    class MockRouter {
        navigate(path: string) { navigateCalled = true; return path; }
    }

    beforeEach(async(() => {
        const contactServiceStub = {
            deleteContact: function(id: string) {
                contactIdToDelete = id;
                contactServiceDeleteContactCalled = true;

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
        const contactNumberServiceStub = {

        };
        const activatedRouteStub = {
            data: []
        };

        TestBed.configureTestingModule({
            declarations: [
                ContactDetailComponent,
                MockContactNumberListComponent
            ],
            imports: [
                RouterTestingModule,
                FormsModule
            ],
            providers: [
                {
                    provide: NgbModal,
                    useValue: modalCompStub
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
        fixture = TestBed.createComponent(ContactDetailComponent);
        activatedRoute = TestBed.get(ActivatedRoute);
        contactService = TestBed.get(ContactService);
        modalService = TestBed.get(NgbModal);

        injector = getTestBed();
    });
    it('should create the app', async(() => {
        const de = fixture.debugElement.componentInstance;
        expect(de).toBeTruthy();
    }));
    describe('on initialisation', () => {
        it(`should have set contact correctly`, fakeAsync(() => {
            activatedRoute.data = Observable.of(dataElement);
            comp = fixture.componentInstance;

            tick();
            fixture.detectChanges();

            expect(comp.contact.title).toEqual('title1');
            expect(comp.contact.forename).toEqual('forename1');
            expect(comp.contact.surname).toEqual('surname1');
        }));
    });
    describe('deleteConfirmation', () => {
        it(`should open modal when is delete is clicked`, async(() => {
            activatedRoute.data = Observable.of(dataElement);
            fixture.detectChanges();

            const deEls = fixture.debugElement.queryAll(By.css('button'));
            expect(deEls[2].nativeElement.textContent).toEqual('Delete');
            const delBtn = deEls[2];
            delBtn.triggerEventHandler('click', null);

            expect(modalServiceOpenCalled).toEqual(true);
        }));
        it(`should call delete contact on contact service when ok is returned from the modal`, fakeAsync(() => {
            activatedRoute.data = Observable.of(dataElement);
            const spy = spyOn(modalService, 'open').and.returnValue(
                {
                    result: Promise.resolve('ok')
                }
            );
            fixture.detectChanges();

            const deEls = fixture.debugElement.queryAll(By.css('button'));
            expect(deEls[2].nativeElement.textContent).toEqual('Delete');
            const delBtn = deEls[2];
            delBtn.triggerEventHandler('click', null);

            expect(modalServiceOpenCalled).toEqual(true);
            tick();
            fixture.detectChanges();
            expect(contactServiceDeleteContactCalled).toEqual(true);
        }));
        it(`should call navigate and toastr success when delete contact is successful`, fakeAsync(() => {
            activatedRoute.data = Observable.of(dataElement);
            const spy = spyOn(modalService, 'open').and.returnValue(
                {
                    result: Promise.resolve('ok')
                }
            );
            contactService.deleteContact = function() {
                contactServiceDeleteContactCalled = true;

                return Observable.of('id1');
            };
            fixture.detectChanges();

            const deEls = fixture.debugElement.queryAll(By.css('button'));
            expect(deEls[2].nativeElement.textContent).toEqual('Delete');
            const delBtn = deEls[2];
            delBtn.triggerEventHandler('click', null);

            expect(modalServiceOpenCalled).toEqual(true);
            tick();
            fixture.detectChanges();
            expect(contactServiceDeleteContactCalled).toEqual(true);
            expect(toastrSuccessCalled).toEqual(true);
            expect(navigateCalled).toEqual(true);
            expect(contact1.deleted).toEqual(true);
        }));
        it(`should call navigate and toastr error when delete contact throws an error`, fakeAsync(() => {
            activatedRoute.data = Observable.of(dataElement);
            const spy = spyOn(modalService, 'open').and.returnValue(
                {
                    result: Promise.resolve('ok')
                }
            );
            contactService.deleteContact = function() {
                contactServiceDeleteContactCalled = true;

                return Observable.throw('error occured');
            };
            fixture.detectChanges();

            const deEls = fixture.debugElement.queryAll(By.css('button'));
            expect(deEls[2].nativeElement.textContent).toEqual('Delete');
            const delBtn = deEls[2];
            delBtn.triggerEventHandler('click', null);

            expect(modalServiceOpenCalled).toEqual(true);
            tick();
            fixture.detectChanges();
            expect(contactServiceDeleteContactCalled).toEqual(true);
            expect(toastrErrorCalled).toEqual(true);
        }));
    });
});
