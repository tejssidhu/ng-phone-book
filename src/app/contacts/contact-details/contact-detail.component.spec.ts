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
import { IContact, ContactService } from '../index';
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
        id: '',
        title: '',
        forename: '',
        surname: ''
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
        const activatedRouteStub = {
            data: []
        };

        TestBed.configureTestingModule({
            declarations: [
                ContactDetailComponent
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

        injector = getTestBed();
    });
    it('should create the app', async(() => {
        const de = fixture.debugElement.componentInstance;
        expect(de).toBeTruthy();
    }));
    describe('on initialisation', () => {
        xit(`should have set contact correctly`, fakeAsync(() => {
            activatedRoute.data = Observable.of([dataElement]);
            comp = fixture.componentInstance;

            tick();
            fixture.detectChanges();

            expect(comp.contact.title).toEqual('');
            expect(comp.contact.forename).toEqual('');
            expect(comp.contact.surname).toEqual('');
        }));
    });
});
