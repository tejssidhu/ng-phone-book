import { Component, OnInit } from '@angular/core';
import { AuthService } from '../common/services/auth.service';

@Component({
    moduleId: module.id,
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html'
})
export class NavBarComponent implements OnInit {
    isAuthenticated: Boolean = false;
    userName: String = '';

    constructor(private authService: AuthService) {

    }

    ngOnInit() {
        this.authService.isLoggedInObs().subscribe(isLoggedOn => {
            if (isLoggedOn) {
                this.isAuthenticated = true;
            } else {
                this.isAuthenticated = false;
            }
        });

        this.authService.getCurrentUser().subscribe(user => {
            if (user) {
                this.userName = user.profile.name;
            }
        });
    }

    login() {
        this.authService.startSigninMainWindow();
    }

    logout() {
        this.authService.startSignoutMainWindow();
    }
}

