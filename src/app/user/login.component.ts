import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../common/services/auth.service';
import { UserService } from './shared/user-service';
import { IUser } from './shared/user-model';

@Component({
    moduleId: module.id,
    selector: 'app-login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
    constructor(private router: Router, private authService: AuthService, private userService: UserService) {

    }

    ngOnInit() {
        const isLoggedIn = this.authService.isLoggedInObs();
        isLoggedIn.subscribe((loggedin) => {
            if (loggedin) {
                // get or create local user
                this.userService.getUser(this.authService.currentUser.profile.sub).subscribe((user) => {
                    if (!user) {
                        const newUser: IUser = {
                            id: this.authService.currentUser.profile.sub,
                            username: this.authService.currentUser.profile.name
                        };
                        this.userService.createUser(newUser).subscribe(() => {
                            this.router.navigate(['contacts']);
                        });
                    } else {
                        this.router.navigate(['contacts']);
                    }
                });
            }
        });
    }
}
