import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { ContactNumberService } from './index';
import { IContactNumber } from './contact-number-model';
import { AuthService } from '../../common/services/auth.service';

describe('ContactNumberService', () => {
    let injector: TestBed;
    let service: ContactNumberService;
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
                ContactNumberService,
                {
                    provide: AuthService,
                    useValue: authServiceStub
                }
            ]
        });
        injector = getTestBed();
        service = injector.get(ContactNumberService);
        httpMock = injector.get(HttpTestingController);
    });
    afterEach(() => {
        httpMock.verify();
    });
    describe('#getContactNumbers', () => {
        it('should return an Observable<IContactNumber[]>', () => {
            const dummyContacts = {
                value: [
                    { contactId: 'contactId1', description: 'description1', telephoneNumber: '0123456789' },
                    { contactId: 'contactId1', description: 'description2', telephoneNumber: '7894561230' }
                ]
            };

            const contactId = 'contactId1';

            service.getContactNumbers(contactId).subscribe(contactNumbers => {
                expect(contactNumbers.length).toBe(dummyContacts.value.length);
                expect(contactNumbers[0].description).toEqual(dummyContacts.value[0].description);
                expect(contactNumbers[1].description).toEqual(dummyContacts.value[1].description);
            });

            const req = httpMock.expectOne(`${environment.serviceRootUrl}Contacts(${contactId})/Phonebook.GetContactNumbers`);
            expect(req.request.method).toBe('GET');
            req.flush(dummyContacts);
        });
    });
    describe('#getContactNumber', () => {
        it('should return an Observable<IContactNumber>', () => {
            const dummyContact = {
                id: 'id1', contactId: 'contactId1', description: 'description1', telephoneNumber: '0123456789'
            };

            service.getContactNumber(dummyContact.id).subscribe(contactNumber => {
                expect(contactNumber.description).toEqual(dummyContact.description);
                expect(contactNumber.telephoneNumber).toEqual(dummyContact.telephoneNumber);
            });

            const req = httpMock.expectOne(`${environment.serviceRootUrl}ContactNumbers(${dummyContact.id})`);
            expect(req.request.method).toBe('GET');
            req.flush(dummyContact);
        });
    });
    describe('#createContact', () => {
        it('should return an Observable<IContactNumber>', () => {
            const dummyContactNumber: IContactNumber = {
                id: 'id1', contactId: 'contactId1', description: 'description1', telephoneNumber: '0123456789', deleted: false
            };

            service.createContactNumber(dummyContactNumber).subscribe(contactNumber => {
                expect(contactNumber.description).toEqual(dummyContactNumber.description);
                expect(contactNumber.telephoneNumber).toEqual(dummyContactNumber.telephoneNumber);
            });

            const req = httpMock.expectOne(`${environment.serviceRootUrl}ContactNumbers`);
            expect(req.request.method).toBe('POST');
            req.flush(dummyContactNumber);
        });
    });
    describe('#updateContactNumber', () => {
        it('should return an Observable<IContactNumber>', () => {
            const dummyContact: IContactNumber = {
                id: 'id1', contactId: 'contactId1', description: 'description1', telephoneNumber: '0123456789', deleted: false
            };

            service.updateContactNumber(dummyContact).subscribe(contactNumber => {
                expect(contactNumber.description).toEqual(dummyContact.description);
                expect(contactNumber.telephoneNumber).toEqual(dummyContact.telephoneNumber);
            });

            const req = httpMock.expectOne(`${environment.serviceRootUrl}ContactNumbers(${dummyContact.id})`);
            expect(req.request.method).toBe('PUT');
            req.flush(dummyContact);
        });
    });
    describe('#deleteContactNumber', () => {
        it('should return an Observable<string>', () => {
            const dummyContact = {
                id: 'id1'
            };

            service.deleteContactNumber(dummyContact.id).subscribe(response => {
                expect(response).toEqual('OK');
            });

            const req = httpMock.expectOne(`${environment.serviceRootUrl}ContactNumbers(${dummyContact.id})`);
            expect(req.request.method).toBe('DELETE');
            req.flush('OK');
        });
    });
});
