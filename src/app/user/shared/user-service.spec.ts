import { UserService } from './user-service';
import { IUser } from './user-model';
import { MockAuthService } from '../../common/services/mock-auth.service';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../common/services/auth.service';

describe('ContactService', () => {
    let injector: TestBed;
    let service: UserService;
    let authService: MockAuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                UserService,
                {
                    provide: AuthService,
                    useClass: MockAuthService
                }
            ]
        });
        injector = getTestBed();
        service = injector.get(UserService);
        authService = TestBed.get(AuthService);
        httpMock = injector.get(HttpTestingController);
    });
    afterEach(() => {
        httpMock.verify();
    });
    describe('#getUser', () => {
        it('should return an Observable<IUser>', () => {
            authService.currentUser = {
                access_token: '1'
            };
            const dummyUser: IUser = {
                id: 'john1', username: 'John.Doe@email'
            };

            service.getUser(dummyUser.id).subscribe(user => {
                expect(user.id).toEqual(dummyUser.id);
                expect(user.username).toEqual(dummyUser.username);
            });

            const req = httpMock.expectOne(`${environment.serviceRootUrl}Users(${dummyUser.id})`);
            expect(req.request.method).toBe('GET');
            req.flush(dummyUser);
        });
    });
    describe('#createUser', () => {
        it('should return an Observable<IUser>', () => {
            authService.currentUser = {
                access_token: '1'
            };
            const dummyUser: IUser = {
                id: 'john1', username: 'John.Doe@email'
            };

            service.createUser(dummyUser).subscribe(user => {
                expect(user.id).toEqual(dummyUser.id);
                expect(user.username).toEqual(dummyUser.username);
            });

            const req = httpMock.expectOne(`${environment.serviceRootUrl}Users`);
            expect(req.request.method).toBe('POST');
            req.flush(dummyUser);
        });
    });
});
