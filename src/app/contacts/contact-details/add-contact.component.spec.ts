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
    const dataElement: any = {
        title: '',
        forename: '',
        surname: ''
    };

    class MockRouter {
        navigate(path: string) { navigateCalled = true; return path; }
    }

    beforeEach(() => {
        const authServiceStub = {
            getUserId: function() {
                authUserGetUserIdCalled = true;
                return '1';
            }
        };
        const contactServiceStub = {
            createContact: function() {
                contactServiceCreateContactCalled = true;
            },
            updateContact: function() {
                contactServiceUpdateContactCalled = true;
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

        fixture = TestBed.createComponent(AddContactComponent);
        activatedRoute = TestBed.get(ActivatedRoute);

        injector = getTestBed();
    });
    it('should create the app', async(() => {
        const de = fixture.debugElement.componentInstance;
        expect(de).toBeTruthy();
    }));
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
    xdescribe('save contact', () => {

    });
});
