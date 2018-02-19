import { ComponentFixture, TestBed, async, fakeAsync, tick, inject } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from '../common/services/auth.service';
import { MockAuthService } from '../common/services/mock-auth.service';
import { MockUserService } from './shared/mock-user-service';
import { UserService } from './shared/user-service';
import { Observable } from 'rxjs/Observable';

describe('LoginComponent', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let de: DebugElement;
    let router: Router;
    let navigateCalled: Boolean;
    let pathToNavigateTo: String;
    const store = {};
    let authService: MockAuthService;
    let userService: MockUserService;
    let comp: LoginComponent;

    class MockRouter {
        navigate(path: string) {
            navigateCalled = true;
            pathToNavigateTo = path;
            return path;
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoginComponent
            ],
            imports: [
                RouterTestingModule
            ],
            providers: [
                {
                    provide: Router,
                    useClass: MockRouter
                },
                {
                    provide: AuthService,
                    useClass: MockAuthService
                },
                {
                    provide: UserService,
                    useClass: MockUserService
                }
            ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        de = fixture.debugElement.componentInstance;

        router = TestBed.get(Router);
        authService = TestBed.get(AuthService);
        userService = TestBed.get(UserService);
    });
    it('should create the app', async(() => {
        expect(de).toBeTruthy();
    }));
    describe('on initialisation', () => {
        it('should call isLoggedInObsCalled on authService', fakeAsync(() => {
            comp = fixture.componentInstance;

            tick();
            fixture.detectChanges();

            expect(authService.isLoggedInObsCalled).toEqual(true);
        }));
        it('should call getUser if user is logged in on userService', fakeAsync(() => {
            comp = fixture.componentInstance;
            authService.data = true;
            authService.currentUser = {
                profile: {
                    sub: '1'
                }
            };

            tick();
            fixture.detectChanges();

            expect(userService.wasGetUserCalled).toEqual(true);
            expect(userService.getUserCalledWithId).toEqual('1');
        }));
        it('should not call getUser if user is not logged in', fakeAsync(() => {
            comp = fixture.componentInstance;
            authService.data = false;
            authService.currentUser = {
                profile: {
                    sub: '1'
                }
            };

            tick();
            fixture.detectChanges();

            expect(userService.wasGetUserCalled).toBeFalsy();
        }));
        it('should call createUser if user doesnt already exist', fakeAsync(() => {
            comp = fixture.componentInstance;
            authService.data = true;
            authService.currentUser = {
                profile: {
                    sub: '1',
                    name: 'name'
                }
            };

            tick();
            fixture.detectChanges();

            expect(userService.wasCreateUserCalled).toEqual(true);
            expect(userService.createUserCalledWithObj.id).toEqual('1');
            expect(userService.createUserCalledWithObj.username).toEqual('name');
        }));
        it('should navigate to contacts page once createUser is successful', fakeAsync(() => {
            comp = fixture.componentInstance;
            authService.data = true;
            authService.currentUser = {
                profile: {
                    sub: '1',
                    name: 'name'
                }
            };

            tick();
            fixture.detectChanges();

            expect(navigateCalled).toEqual(true);
            expect(pathToNavigateTo).toEqual(['contacts']);
        }));
        it('should not call createUser if user already exist', fakeAsync(() => {
            comp = fixture.componentInstance;
            authService.data = true;
            authService.currentUser = {
                profile: {
                    sub: '1'
                }
            };
            userService.data = true;

            tick();
            fixture.detectChanges();

            expect(userService.wasCreateUserCalled).toBeFalsy();
        }));
        it('should navigate to contacts if user already exist', fakeAsync(() => {
            comp = fixture.componentInstance;
            authService.data = true;
            authService.currentUser = {
                profile: {
                    sub: '1'
                }
            };
            userService.data = true;

            tick();
            fixture.detectChanges();

            expect(navigateCalled).toEqual(true);
            expect(pathToNavigateTo).toEqual(['contacts']);
        }));
    });
    describe('on login', () => {
        it('should call startSigninMainWindow on authService', fakeAsync(() => {
            comp = fixture.componentInstance;
            authService.data = false;

            comp.login();

            tick();
            fixture.detectChanges();

            expect(authService.wasStartSigninMainWindowCalled).toEqual(true);
        }));
    });
});
