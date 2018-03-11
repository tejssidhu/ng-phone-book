import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IUser } from './user-model';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import * as myGlobals from '../../shared/globals';
import { of } from 'rxjs/observable/of';
import { AuthService  } from '../../common/services/auth.service';

@Injectable()
export class UserService {
    constructor(private http: HttpClient, private authService: AuthService) {

    }

    getUser(userId: string): Observable<IUser> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authService.currentUser.access_token});

        return this.http.get<IUser>(myGlobals.serviceRootUrl + 'Users(' + userId + ')', {headers: headers}).pipe(
            tap((userExists: IUser) => console.log(`User exists: ${userExists}`)),
            catchError(this.handleError<any>('doesUserExist'))
        );
    }

    createUser(user: IUser): Observable<IUser> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authService.currentUser.access_token});

        return this.http.post<IUser>(myGlobals.serviceRootUrl + 'Users', JSON.stringify(user), {headers: headers}).pipe(
            tap((newUser: IUser) => console.log(`user created: userId=${newUser.id}`)),
            catchError(this.handleError<any>('createUser'))
        );
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
}
