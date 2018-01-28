import { Component  } from '@angular/core';
// import { AuthService } from './shared/index';
import { Router  } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'app-login',
    templateUrl: 'login.component.html'
})
export class LoginComponent {
    model: any = {};
    loginInvalid = false;

    constructor(private router: Router) { // private authService: AuthService,

    }

    // login() {
    //     this.authService.loginUser(this.model.username, this.model.password).subscribe(
    //         returnedUser => {
    //             const user = returnedUser;
    //             if (user) {
    //                 localStorage.setItem('currentUser', JSON.stringify(user));
    //                 this.router.navigate(['contacts']);
    //             } else {
    //                 this.loginInvalid = true;
    //             }
    //         },
    //         error => {
    //             this.loginInvalid = true;
    //         }
    //     );
    // }
}
