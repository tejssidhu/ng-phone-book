import { TestBed, async } from '@angular/core/testing';
import { LoginComponent } from './login.component';

import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
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
        LoginComponent
      ],
      imports: [
        RouterTestingModule,
        FormsModule
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
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
