import { ComponentFixture, TestBed, async, fakeAsync, tick, inject } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from '../common/services/auth.service';
import { MockAuthService } from '../common/services/mock-auth.service';

describe('LoginComponent', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let de: DebugElement;
    let router: Router;
    let navigateCalled: Boolean;
    const store = {};
    let authService: AuthService;

    class MockRouter {
        navigate(path: string) { navigateCalled = true; return path; }
    }

    beforeEach(async(() => {
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
                }
            ]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        de = fixture.debugElement.componentInstance;

        router = TestBed.get(Router);
        authService = TestBed.get(AuthService);
    });
    xit('should create the app', async(() => {
        expect(de).toBeTruthy();
    }));
});
