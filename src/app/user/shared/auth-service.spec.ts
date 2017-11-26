import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as myGlobals from '../../shared/globals';
import { AuthService } from './index';

describe('AuthService', () => {
    let injector: TestBed;
    let service: AuthService;
    let httpMock: HttpTestingController;
    const store = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AuthService]
        });
        injector = getTestBed();
        service = injector.get(AuthService);
        httpMock = injector.get(HttpTestingController);

        spyOn(localStorage, 'getItem').and.callFake(function (key) {
            return store[key];
        });
        spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
            return store[key] = value + '';
        });
        spyOn(localStorage, 'removeItem').and.callFake(function (key, value) {
            delete store[key];
        });
    });
    afterEach(() => {
        httpMock.verify();
    });
    describe('#loginUser', () => {
        it('should return an Observable<IUser>', () => {
          const dummyUser = { id: 'John', username: 'johndoe'};

          service.loginUser('username', 'password').subscribe(user => {
            expect(user.id).toBe(dummyUser.id);
            expect(user.username).toEqual(dummyUser.username);
          });

          const req = httpMock.expectOne(`${myGlobals.serviceRootUrl}Authenticate`);
          expect(req.request.method).toBe('POST');
          req.flush(dummyUser);
        });
    });
    describe('#logout', () => {
        it('should remove currentUser from localStorage', () => {
            localStorage.setItem('currentUser', 'a user');

            expect(localStorage.getItem('currentUser')).toEqual('a user');
            service.logout();
            expect(localStorage.getItem('currentUser')).toBeUndefined();
        });
    });
    describe('#isAuthenticated', () => {
        it('should return true if the currentUser is in localstorage', () => {
            localStorage.setItem('currentUser', 'a user');

            const isAuthenticated = service.isAuthenticated();
            expect(isAuthenticated).toBeTruthy();
        });
    });
    describe('#getUserId', () => {
        it('should return user id', () => {
            const user = { id: 'id', username: 'username' };
            localStorage.setItem('currentUser', JSON.stringify(user));

            const userId = service.getUserId();
            expect(userId).toEqual(user.id);
        });
    });
});
