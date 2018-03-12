import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IContact } from './contact-model';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs/observable/of';
import { AuthService  } from '../../common/services/auth.service';

@Injectable()
export class ContactService {
    constructor(private http: HttpClient, private authService: AuthService) {

    }

    getContacts(userId: string): Observable<IContact[]> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authService.currentUser.access_token});

        return this.http.get<any>(environment.serviceRootUrl + 'Users(' + userId + ')' + '/Contacts', {headers: headers}).pipe(
            map(data => {
                return <IContact[]>data.value;
            }),
            tap((contacts: IContact[]) => console.log(`${contacts.length} contacts loaded`)),
            catchError(this.handleError<any>('getContacts'))
        );
    }

    getContact(id: string): Observable<IContact> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authService.currentUser.access_token});

        return this.http.get<IContact>(environment.serviceRootUrl + 'Contacts(' + id + ')', {headers: headers}).pipe(
            tap((contact: IContact) => console.log(`${contact.id} contact loaded`)),
            catchError(this.handleError<any>('getContact'))
        );
    }

    createContact(contact: IContact): Observable<IContact> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authService.currentUser.access_token});

        return this.http.post<IContact>(environment.serviceRootUrl + 'Contacts', JSON.stringify(contact), {headers: headers}).pipe(
            tap((newContact: IContact) => console.log(`contact created: userId=${newContact.id}`)),
            catchError(this.handleError<any>('createContact'))
        );
    }

    updateContact(contact: IContact): Observable<IContact> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authService.currentUser.access_token});

        return this.http.put(environment.serviceRootUrl + 'Contacts(' + contact.id + ')', JSON.stringify(contact), {headers: headers}).pipe(
            tap((newContact: IContact) => console.log(`contact updated: userId=${newContact.id}`)),
            catchError(this.handleError<any>('createContact'))
        );
    }

    deleteContact(id: string): Observable<string> {
        const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authService.currentUser.access_token});

        return this.http.delete(environment.serviceRootUrl + 'Contacts(' + id + ')', {headers: headers}).pipe(
            tap((response: string) => console.log(`contact deleted: userId=${response}`)),
            catchError(this.handleError<any>('createContact'))
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
