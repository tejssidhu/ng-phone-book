import { ComponentFixture, TestBed, async, fakeAsync, tick, inject } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './index';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';
import { IUser } from './index';

describe('LoginComponent', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let authService: AuthService;
    let router: Router;
    let logOutCalled: Boolean;
    let loginUserCalled: Boolean;
    let navigateCalled: Boolean;
    const store = {};

    class MockRouter {
        navigate(path: string) { navigateCalled = true; return path; }
    }

    beforeEach(async(() => {
        const authServiceStub = {
            isAuthenticated: function() {
                return false;
            },
            logout: function() {
                logOutCalled = true;
            },
            loginUser: function() {
                loginUserCalled = true;
            }
        };
        const routerStub = {
            navigate: function() {
                navigateCalled = true;
            }
        };

        TestBed.configureTestingModule({
            declarations: [
                LoginComponent
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
                    provide: Router,
                    useClass: MockRouter
                }
            ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);

        authService = TestBed.get(AuthService);
        router = TestBed.get(Router);

        spyOn(localStorage, 'getItem').and.callFake(function (key) {
            return store[key];
        });
        spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
            return store[key] = value + '';
        });
        spyOn(localStorage, 'removeItem').and.callFake(function (key, value) {
            delete store[key];
        });
    });
    it('should create the app', async(() => {
        const de = fixture.debugElement.componentInstance;
        expect(de).toBeTruthy();
    }));
    it(`should have title 'Login'`, async(() => {
        const titleEl = fixture.debugElement.query(By.css('h2'));
        const el = titleEl.nativeElement;
        expect(el.textContent).toEqual('Login');
    }));
    it(`should have called logout when initialised`, async(() => {
        fixture.detectChanges();
        expect(logOutCalled).toEqual(true);
    }));
    it(`should have a username input`, async(() => {
        const de = fixture.debugElement.query(By.css('#username'));
        const el = de.nativeElement;
        expect(el).toBeTruthy();
    }));
    it(`should have a password input`, async(() => {
        const de = fixture.debugElement.query(By.css('#password'));
        const el = de.nativeElement;
        expect(el).toBeTruthy();
    }));
    it(`should have a button with text Login`, async(() => {
        const de = fixture.debugElement.query(By.css('button'));
        const el = de.nativeElement;
        expect(el).toBeTruthy();
        expect(el.textContent).toBe('Login');
    }));
    it(`should have called loginUser when form is submitted`, async(() => {
        const form = fixture.debugElement.query(By.css('form'));
        form.triggerEventHandler('submit', null);
        expect(loginUserCalled).toEqual(true);
    }));

    describe('#login', () => {
        it(`should have set loginInvalid and display warning message when loginUser doesnt return a user`, fakeAsync(() => {
            authService.loginUser = function() {
                return Observable.of(null);
            };
            const comp = fixture.debugElement.componentInstance;
            comp.login();

            tick();

            fixture.detectChanges();
            expect(comp.loginInvalid).toEqual(true);

            const de = fixture.debugElement.query(By.css('.bg-danger'));
            expect(de).toBeTruthy();
        }));
        it(`should navigate to a route when loginUser returns a user`, fakeAsync(() => {
            authService.loginUser = function() {
                const user: IUser = { id: 'id', username: 'username' };
                return Observable.of(user);
            };
            const comp = fixture.debugElement.componentInstance;
            comp.login();

            tick();

            fixture.detectChanges();
            expect(comp.loginInvalid).toEqual(false);
            expect(navigateCalled).toEqual(true);
        }));
        it('should navigate to contacts route', inject([Router], (lRouter: Router) => {
            const spy = spyOn(lRouter, 'navigate');
            authService.loginUser = function() {
                const user: IUser = { id: 'id', username: 'username' };
                return Observable.of(user);
            };
            const comp = fixture.debugElement.componentInstance;

            comp.login();

            fixture.detectChanges();

            const navArgs = spy.calls.first().args[0];

            expect(navArgs[0]).toBe('contacts', 'should nav to contacts');
        }));
        it(`should set currentUser item in localstorage when loginUser returns a user`, fakeAsync(() => {
            const user: IUser = { id: 'id', username: 'username' };

            authService.loginUser = function() {
                return Observable.of(user);
            };
            const comp = fixture.debugElement.componentInstance;
            comp.login();

            tick();

            fixture.detectChanges();
            expect(localStorage.getItem('currentUser')).toEqual(JSON.stringify(user));
        }));
        it(`should have set loginInvalid and display warning message when loginUser throws an error`, fakeAsync(() => {
            authService.loginUser = function() {
                return Observable.throw('error occured');
            };
            const comp = fixture.debugElement.componentInstance;
            comp.login();

            tick();

            fixture.detectChanges();
            expect(comp.loginInvalid).toEqual(true);

            const de = fixture.debugElement.query(By.css('.bg-danger'));
            expect(de).toBeTruthy();
        }));
    });
});
