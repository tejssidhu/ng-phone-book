import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {

    }

    canActivate() {
        const isLoggedIn = this.authService.isLoggedInObs();
        isLoggedIn.subscribe((loggedin) => {
            if (!loggedin) {
                this.authService.startSigninMainWindow();
                // this.router.navigate(['login']);
            }
        });
        return isLoggedIn;
    }
}
