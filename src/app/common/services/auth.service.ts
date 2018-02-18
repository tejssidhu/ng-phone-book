import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/RX';
import { UserManager, User, Log } from 'oidc-client';

Log.logger = console;
Log.level = Log.DEBUG;

@Injectable()
export class AuthService {
    userLoadededEvent: EventEmitter<User> = new EventEmitter<User>();
    currentUser: User;
    loggedIn = false;

    constructor(private userManager: UserManager) {
        this.userManager.getUser()
            .then((user) => {
                if (user) {
                    this.loggedIn = true;
                    this.currentUser = user;
                    this.userLoadededEvent.emit(user);
                } else {
                    this.loggedIn = false;
                }
            })
            .catch((err) => {
                this.loggedIn = false;
            });

        this.userManager.events.addUserLoaded((user) => {
            this.currentUser = user;
            console.log('authService addUserLoaded', user);
        });

        this.userManager.events.addUserUnloaded((e) => {
            console.log('user unloaded');
            this.loggedIn = false;
        });
    }

    isLoggedInObs(): Observable<boolean> {
        return Observable.fromPromise(this.userManager.getUser())
        .map<User, boolean>((user) => {
            if (user) {
                if (user.expired) {
                    return false;
                }
                return true;
            } else {
                return false;
            }
        });
    }

    getCurrentUser(): Observable<User> {
        return Observable.fromPromise(this.userManager.getUser());
    }

    // getUser() {
    //     this.userManager.getUser().then((user) => {
    //         this.currentUser = user;
    //         console.log('got user', user);
    //         this.userLoadededEvent.emit(user);
    //     }).catch(function (err) {
    //         console.log(err);
    //     });
    // }


    startSigninMainWindow() {
        this.userManager.signinRedirect().then(function () {
            console.log('signinRedirect done');
        }).catch(function (err) {
            console.log(err);
        });
    }

    startSignoutMainWindow() {
        this.userManager.signoutRedirect().then(function (resp) {
            console.log('signed out', resp);
            setTimeout(5000, () => {
                console.log('testing to see if fired...');
            });
        }).catch(function (err) {
            console.log(err);
        });
    }
}
