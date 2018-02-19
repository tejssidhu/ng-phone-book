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
import { ContactNumberDetailComponent } from './index';
import { IContactNumber, ContactNumberService } from '../../index';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('ContactDetailComponent', () => {
    let fixture: ComponentFixture<ContactNumberDetailComponent>;
    let injector: TestBed;
    let comp: ContactNumberDetailComponent;
    const contactNumber1: IContactNumber = { id: 'id1', contactId: 'contactId1', description: 'description1', telephoneNumber: 'telephoneNumber1', deleted: false };
    let toastrSuccessCalled: Boolean;
    let toastrErrorCalled: Boolean;
    let contactNumberServiceDeleteContactNumberCalled: Boolean;
    let modalServiceOpenCalled: Boolean;
    let modalServiceContent: string;
    let navigateCalled: Boolean;
    let activatedRoute: ActivatedRoute;
    let contactNumberService: ContactNumberService;
    let contactNumberIdToDelete: string;
    let throwError: Boolean;
    let modalService: NgbModal;

    const dataElement: any = {
        'contactNumber': contactNumber1
    };

    class MockRouter {
        navigate(path: string) { navigateCalled = true; return path; }
    }

    beforeEach(async(() => {
        const contactNumberServiceStub = {
            deleteContactNumber: function(id: string) {
                contactNumberIdToDelete = id;
                contactNumberServiceDeleteContactNumberCalled = true;

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
        const activatedRouteStub = {
            data: []
        };

        TestBed.configureTestingModule({
            declarations: [
                ContactNumberDetailComponent
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
                    provide: ContactNumberService,
                    useValue: contactNumberServiceStub
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
        fixture = TestBed.createComponent(ContactNumberDetailComponent);
        activatedRoute = TestBed.get(ActivatedRoute);
        contactNumberService = TestBed.get(ContactNumberService);
        modalService = TestBed.get(NgbModal);

        injector = getTestBed();
    });
    it('should create the app', async(() => {
        const de = fixture.debugElement.componentInstance;
        expect(de).toBeTruthy();
    }));
    describe('on initialisation', () => {
        it(`should have set contact number correctly`, fakeAsync(() => {
            activatedRoute.data = Observable.of(dataElement);
            comp = fixture.componentInstance;

            tick();
            fixture.detectChanges();

            expect(comp.contactNumber.description).toEqual('description1');
            expect(comp.contactNumber.telephoneNumber).toEqual('telephoneNumber1');
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
        it(`should call delete contact number on contact number service when ok is returned from the modal`, fakeAsync(() => {
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
            expect(contactNumberServiceDeleteContactNumberCalled).toEqual(true);
        }));
        it(`should call navigate and toastr success when delete contact number is successful`, fakeAsync(() => {
            activatedRoute.data = Observable.of(dataElement);
            const spy = spyOn(modalService, 'open').and.returnValue(
                {
                    result: Promise.resolve('ok')
                }
            );
            contactNumberService.deleteContactNumber = function() {
                contactNumberServiceDeleteContactNumberCalled = true;

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
            expect(contactNumberServiceDeleteContactNumberCalled).toEqual(true);
            expect(toastrSuccessCalled).toEqual(true);
            expect(navigateCalled).toEqual(true);
            expect(contactNumber1.deleted).toEqual(true);
        }));
        it(`should call navigate and toastr error when delete contact number throws an error`, fakeAsync(() => {
            activatedRoute.data = Observable.of(dataElement);
            const spy = spyOn(modalService, 'open').and.returnValue(
                {
                    result: Promise.resolve('ok')
                }
            );
            contactNumberService.deleteContactNumber = function() {
                contactNumberServiceDeleteContactNumberCalled = true;

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
            expect(contactNumberServiceDeleteContactNumberCalled).toEqual(true);
            expect(toastrErrorCalled).toEqual(true);
        }));
    });
});
