import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/RX';
import { IContact } from './contact-model';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import * as myGlobals from '../../shared/globals';
import { of } from 'rxjs/observable/of';

const httpOptions = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
};

@Injectable()
export class ContactService {
    constructor(private http: HttpClient) {

    }

    getContacts(userId: string): Observable<IContact[]> {
        return this.http.get<any>(myGlobals.serviceRootUrl + 'Users(' + userId + ')' + '/Phonebook.MyContacts').pipe(
            map(data => {
                return <IContact[]>data.value;
            }),
            tap((contacts: IContact[]) => console.log(`${contacts.length} contacts loaded`)),
            catchError(this.handleError<any>('getContacts'))
        );
    }

    getContact(id: string): Observable<IContact> {
        return this.http.get<IContact>(myGlobals.serviceRootUrl + 'Contacts(' + id + ')').pipe(
            tap((contact: IContact) => console.log(`${contact.id} contact loaded`)),
            catchError(this.handleError<any>('getContact'))
        );
    }
    // return <IContact>response.json();

    createContact(contact: IContact): Observable<IContact> {
        return this.http.post<IContact>(myGlobals.serviceRootUrl + 'Contacts', JSON.stringify(contact), httpOptions).pipe(
            tap((newContact: IContact) => console.log(`contact created: userId=${newContact.id}`)),
            catchError(this.handleError<any>('createContact'))
        );
    }
    // let contact = <IContact>response.json();
    // return contact;

    updateContact(contact: IContact): Observable<IContact> {
        return this.http.put(myGlobals.serviceRootUrl + 'Contacts(' + contact.id + ')', JSON.stringify(contact), httpOptions).pipe(
            tap((newContact: IContact) => console.log(`contact updated: userId=${newContact.id}`)),
            catchError(this.handleError<any>('createContact'))
        );
    }
    // let contact = <IContact>response.json();
    // return contact;

    deleteContact(id: string): Observable<string> {
        return this.http.delete(myGlobals.serviceRootUrl + 'Contacts(' + id + ')').pipe(
            tap((response: string) => console.log(`contact updated: userId=${response}`)),
            catchError(this.handleError<any>('createContact'))
        );
    }
    // let status = response.status;
    // return status;

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
