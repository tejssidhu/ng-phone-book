import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IContactNumber } from './contact-number-model';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs/observable/of';
import { AuthService  } from '../../common/services/auth.service';

@Injectable()
export class ContactNumberService {
    constructor(private http: HttpClient, private authService: AuthService) {

    }

    getContactNumbers(contactId: string): Observable<IContactNumber[]> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authService.currentUser.access_token});

        return this.http.get<any>(environment.serviceRootUrl + 'Contacts(' + contactId + ')' + '/ContactNumbers', {headers: headers}).pipe(
            map(data => {
                return <IContactNumber[]>data.value;
            }),
            tap((contactNumbers: IContactNumber[]) => console.log(`${contactNumbers.length} contact numbers loaded`)),
            catchError(this.handleError<any>('getContactNumbers'))
        );
    }

    getContactNumber(id: string): Observable<IContactNumber> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authService.currentUser.access_token});

        return this.http.get<IContactNumber>(environment.serviceRootUrl + 'ContactNumbers(' + id + ')', {headers: headers}).pipe(
            tap((contactNumber: IContactNumber) => console.log(`${contactNumber.id} contact loaded`)),
            catchError(this.handleError<any>('getContact'))
        );
    }

    createContactNumber(contactNumber: IContactNumber): Observable<IContactNumber> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authService.currentUser.access_token});

        return this.http.post<IContactNumber>(environment.serviceRootUrl + 'ContactNumbers', JSON.stringify(contactNumber), {headers: headers}).pipe(
            tap((newContactNumber: IContactNumber) => console.log(`contact number created: Id=${newContactNumber.id}`)),
            catchError(this.handleError<any>('createContactNumber'))
        );
    }

    updateContactNumber(contactNumber: IContactNumber): Observable<IContactNumber> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authService.currentUser.access_token});

        return this.http.put(environment.serviceRootUrl + 'ContactNumbers(' + contactNumber.id + ')', JSON.stringify(contactNumber), {headers: headers}).pipe(
            tap((newContactNumber: IContactNumber) => console.log(`contact number updated: Id=${newContactNumber.id}`)),
            catchError(this.handleError<any>('updateContactNumber'))
        );
    }

    deleteContactNumber(id: string): Observable<string> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authService.currentUser.access_token});

        return this.http.delete(environment.serviceRootUrl + 'ContactNumbers(' + id + ')', {headers: headers}).pipe(
            tap((response: string) => console.log(`contact number deleted: Id=${response}`)),
            catchError(this.handleError<any>('deleteContactNumber'))
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
