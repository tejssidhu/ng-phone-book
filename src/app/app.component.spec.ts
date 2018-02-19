import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { NavBarComponent } from './nav/index';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from './common/services/auth.service';

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
          provide: ToastsManager,
          useValue: toastr
        },
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
