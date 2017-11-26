import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NavBarComponent } from './navbar.component';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../user/index';
import { By } from '@angular/platform-browser';

describe('NavBarComponent', () => {
    let fixture: ComponentFixture<NavBarComponent>;
    let de: DebugElement;
    let authService: AuthService;

    beforeEach(async(() => {
        const authServiceStub = {
            isAuthenticated: function() {
                return false;
            }
        };

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
            useValue: authServiceStub
            }
        ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(NavBarComponent);
        de = fixture.debugElement.componentInstance;

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
    it(`should have 1 nav-link with text 'Login' when not authenticated`, async(() => {
        fixture.detectChanges();
        const deEl = fixture.debugElement.query(By.css('.nav-link'));
        const el = deEl.nativeElement;
        expect(el.textContent).toEqual('Login');
    }));
    it(`should have 2 nav-link with text 'My Contacts' and 'Logout' when authenticated`, async(() => {
        authService.isAuthenticated = function() {
            return true;
        };
        fixture.detectChanges();
        const deEl = fixture.debugElement.queryAll(By.css('.nav-link'));
        expect(deEl.length).toEqual(2);
        const firstEl = deEl[0].nativeElement;
        expect(firstEl.textContent).toEqual('My Contacts');
        const secondEl = deEl[1].nativeElement;
        expect(secondEl.textContent).toEqual('Log out');
    }));
});
