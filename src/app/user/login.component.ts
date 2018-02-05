import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../common/services/auth.service';

@Component({
    moduleId: module.id,
    selector: 'app-login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
    model: any = {};
    loginInvalid = false;

    constructor(private router: Router, private authService: AuthService) {

    }

    ngOnInit() {
        const isLoggedIn = this.authService.isLoggedInObs();
        isLoggedIn.subscribe((loggedin) => {
            if (loggedin) {
                this.router.navigate(['contacts']);
            }
        });
    }
}
