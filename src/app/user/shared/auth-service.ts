import { Injectable } from '@angular/core';
import { IUser } from './user-model';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/RX';
import { catchError, map, tap } from 'rxjs/operators';
import * as myGlobals from '../../shared/globals';
import { of } from 'rxjs/observable/of';

const httpOptions = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
};

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) {
    }

    loginUser(userName: string, password: string): Observable<IUser> {
        const loginInfo = { username: userName, password: password };

        return this.http.post<IUser>(myGlobals.serviceRootUrl + 'Authenticate', loginInfo, httpOptions).pipe(
            tap((user: IUser) => console.log(`user authenticated: userId=${user.id}`)),
            catchError(this.handleError<any>('loginUser'))
        );
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    isAuthenticated() {
        const user = localStorage.getItem('currentUser');
        return!!user;
    }

    getUserId() {
        if (this.isAuthenticated()) {
            const user = <IUser>JSON.parse(localStorage.getItem('currentUser'));
            return user.id;
        }
    }
}
