import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NavBarComponent } from './navbar.component';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('NavBarComponent', () => {
    let fixture: ComponentFixture<NavBarComponent>;
    let de: DebugElement;

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
        providers: [ ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(NavBarComponent);
        de = fixture.debugElement.componentInstance;
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
});
