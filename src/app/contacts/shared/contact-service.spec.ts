import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as myGlobals from '../../shared/globals';
import { ContactService } from './index';
import { IContact } from './contact-model';
import { AuthService } from '../../common/services/auth.service';

describe('ContactService', () => {
    let injector: TestBed;
    let service: ContactService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        const authServiceStub = {
            currentUser: {
                access_token: '1'
            }
        };
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ContactService,
                {
                    provide: AuthService,
                    useValue: authServiceStub
                }
            ]
        });
        injector = getTestBed();
        service = injector.get(ContactService);
        httpMock = injector.get(HttpTestingController);
    });
    afterEach(() => {
        httpMock.verify();
    });
    describe('#getContacts', () => {
        it('should return an Observable<IContact[]>', () => {
            const dummyContacts = {
                value: [
                    { id: 'john1', userId: 'johnUserId', title: 'Mr', forename: 'John', surname: 'Doe', email: 'John.Doe@email' },
                    { id: 'sarah2', userId: 'sarahUserId', title: 'Mrs', forename: 'Sarah', surname: 'Jane', email: 'Sarah.Jane@email' }
                ]
            };

            const userId = '123';

            service.getContacts(userId).subscribe(contacts => {
                expect(contacts.length).toBe(dummyContacts.value.length);
                expect(contacts[0].userId).toEqual(dummyContacts.value[0].userId);
                expect(contacts[1].userId).toEqual(dummyContacts.value[1].userId);
            });

            const req = httpMock.expectOne(`${myGlobals.serviceRootUrl}Users(${userId})/Phonebook.MyContacts`);
            expect(req.request.method).toBe('GET');
            req.flush(dummyContacts);
        });
    });
    describe('#getContact', () => {
        it('should return an Observable<IContact>', () => {
            const dummyContact = {
                 id: 'sarah2', userId: 'sarahUserId', title: 'Mrs', forename: 'Sarah', surname: 'Jane', email: 'Sarah.Jane@email'
            };

            service.getContact(dummyContact.id).subscribe(contact => {
                expect(contact.userId).toEqual(dummyContact.userId);
                expect(contact.email).toEqual(dummyContact.email);
            });

            const req = httpMock.expectOne(`${myGlobals.serviceRootUrl}Contacts(${dummyContact.id})`);
            expect(req.request.method).toBe('GET');
            req.flush(dummyContact);
        });
    });
    describe('#createContact', () => {
        it('should return an Observable<IContact>', () => {
            const dummyContact: IContact = {
                 id: 'sarah2', userId: 'sarahUserId', title: 'Mrs', forename: 'Sarah', surname: 'Jane', email: 'Sarah.Jane@email', deleted: false
            };

            service.createContact(dummyContact).subscribe(contact => {
                expect(contact.userId).toEqual(dummyContact.userId);
                expect(contact.email).toEqual(dummyContact.email);
            });

            const req = httpMock.expectOne(`${myGlobals.serviceRootUrl}Contacts`);
            expect(req.request.method).toBe('POST');
            req.flush(dummyContact);
        });
    });
    describe('#updateContact', () => {
        it('should return an Observable<IContact>', () => {
            const dummyContact: IContact = {
                 id: 'sarah2', userId: 'sarahUserId', title: 'Mrs', forename: 'Sarah', surname: 'Jane', email: 'Sarah.Jane@email', deleted: false
            };

            service.updateContact(dummyContact).subscribe(contact => {
                expect(contact.userId).toEqual(dummyContact.userId);
                expect(contact.email).toEqual(dummyContact.email);
            });

            const req = httpMock.expectOne(`${myGlobals.serviceRootUrl}Contacts(${dummyContact.id})`);
            expect(req.request.method).toBe('PUT');
            req.flush(dummyContact);
        });
    });
    describe('#deleteContact', () => {
        it('should return an Observable<string>', () => {
            const dummyContact = {
                 id: 'sarah2'
            };

            service.deleteContact(dummyContact.id).subscribe(response => {
                expect(response).toEqual('OK');
            });

            const req = httpMock.expectOne(`${myGlobals.serviceRootUrl}Contacts(${dummyContact.id})`);
            expect(req.request.method).toBe('DELETE');
            req.flush('OK');
        });
    });
});
