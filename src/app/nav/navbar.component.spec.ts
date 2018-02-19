import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { NavBarComponent } from './navbar.component';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '../common/services/auth.service';
import { MockAuthService } from '../common/services/mock-auth.service';

describe('NavBarComponent', () => {
    let fixture: ComponentFixture<NavBarComponent>;
    let de: DebugElement;
    const isLoggedInObsCalled: Boolean = false;
    let authService: MockAuthService;
    let comp: NavBarComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            NavBarComponent
        ],
        imports: [
            RouterTestingModule
        ],
        providers: [
            {
                provide: AuthService,
                useClass: MockAuthService
            }
        ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(NavBarComponent);
        de = fixture.debugElement.componentInstance;
        comp = fixture.componentInstance;

        authService = TestBed.get(AuthService);
    });
    it('should create the app', async(() => {
        expect(de).toBeTruthy();
    }));
    it(`should have brand 'ngPhonebook App'`, async(() => {
        const brandDe = fixture.debugElement.query(By.css('.navbar-brand'));
        const el = brandDe.nativeElement;
        expect(el.textContent).toEqual('ngPhonebook App');
    }));
    it(`should have 1 nav-link with text 'My Contacts'`, async(() => {
        fixture.detectChanges();
        const deEl = fixture.debugElement.query(By.css('.nav-link'));
        const el = deEl.nativeElement;
        expect(el.textContent).toEqual('My Contacts');
    }));
    describe('on initialisation', () => {
        it('should call isLoggedInObsCalled on authService', fakeAsync(() => {
            comp = fixture.componentInstance;

            tick();
            fixture.detectChanges();

            expect(authService.isLoggedInObsCalled).toEqual(true);
        }));
        it('should set isAuthenticated to true if isLoggedInObsCalled returns true', fakeAsync(() => {
            authService.data = {
                profile: {
                    name: 'name'
                }
            };
            comp = fixture.componentInstance;

            tick();
            fixture.detectChanges();

            expect(comp.isAuthenticated).toEqual(true);
        }));
        it('should set userName to name of returned user', fakeAsync(() => {
            authService.data = {
                profile: {
                    name: 'returned User Name'
                }
            };
            comp = fixture.componentInstance;

            tick();
            fixture.detectChanges();

            expect(comp.userName).toEqual('returned User Name');
        }));
        it('should set isAuthenticated to false if isLoggedInObsCalled returns false', fakeAsync(() => {
            authService.data = false;
            comp = fixture.componentInstance;

            tick();
            fixture.detectChanges();

            expect(comp.isAuthenticated).toEqual(false);
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
    describe('on logout', () => {
        it('should call startSignoutMainWindow on authService', fakeAsync(() => {
            comp = fixture.componentInstance;
            authService.data = false;

            comp.logout();

            tick();
            fixture.detectChanges();

            expect(authService.wasStartSignoutMainWindowCalled).toEqual(true);
        }));
    });
});
