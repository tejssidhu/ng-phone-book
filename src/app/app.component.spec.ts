import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { NavBarComponent } from './nav/index';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './user/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


describe('AppComponent', () => {
  beforeEach(async(() => {
    const authService = {
      isAuthenticated() {
        return false;
      }
    };
    const toastr = {
      setRootViewContainerRef() {
        return true;
      }
    };

    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavBarComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        {
          provide: AuthService,
          useValue: authService
        },
        {
          provide: ToastsManager,
          useValue: toastr
        }
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
/*   it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
  })); */
});
