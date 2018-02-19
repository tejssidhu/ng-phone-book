import { AuthService } from './auth.service';
import { UserManager, User } from 'oidc-client';

describe('AuthService', () => {
    let userManager: any;
    let service: AuthService;
    let testUser: User = {
        id_token: 'id_token',
        session_state: 'session_state',
        access_token: 'access_token',
        token_type: 'token_type',
        scope: 'scope',
        profile: 'profile',
        expires_at: 1,
        state: 'state',
        toStorageString: (() => ''),
        expires_in: 1,
        expired: false,
        scopes: ['scopes']
    };
    afterEach(() => {
        userManager.getUserCalled = false;
        userManager.addUserLoadedCalled = false;
        userManager.addUserUnloadedCalled = false;
    });
    describe('on initialise', () => {
        beforeEach(() => {
            userManager = new MockUserManager();
            service = new AuthService(userManager);
        });
        it('getUser is called', () => {
            expect(userManager.getUserCalled).toBeTruthy();
        });
        it('addUserLoaded is called', () => {

            expect(userManager.events.addUserLoadedCalled).toBeTruthy();
        });
        it('addUserUnloaded is called', () => {
            expect(userManager.events.addUserUnloadedCalled).toBeTruthy();
        });
    });
    describe('when getUser returns a valid user', () => {
        beforeEach(() => {
            userManager = new MockUserManager();
            userManager.setData(testUser);
            service = new AuthService(userManager);
        });
        it('on initialise loggedIn is true', () => {
            expect(service.loggedIn).toBeTruthy();
        });
        it('on initialise currentUser is correct', () => {
            expect(service.currentUser).toEqual(testUser);
        });
        it('isLoggedInObs loggedIn is true', () => {
            userManager = new MockUserManager();
            userManager.setData(testUser);
            service = new AuthService(userManager);

            service.isLoggedInObs().subscribe((loggedin) => {
                expect(loggedin).toBeTruthy();
            });
        });
    });
    describe('when getUser returns an invalid user', () => {
        beforeEach(() => {
            userManager = new MockUserManager();
            userManager.setError({});
            service = new AuthService(userManager);
        });
        it('loggedIn is false', () => {
            expect(service.loggedIn).toBeFalsy();
        });
        it('loggedIn is false', () => {
            service.isLoggedInObs().subscribe((loggedin) => {
                expect(loggedin).toBeFalsy();
            });
        });
    });
    describe('isLoggedInObs with valid but expired user', () => {
        it('loggedIn is false', () => {
            userManager = new MockUserManager();
            testUser = {
                id_token: 'id_token',
                session_state: 'session_state',
                access_token: 'access_token',
                token_type: 'token_type',
                scope: 'scope',
                profile: 'profile',
                expires_at: 1,
                state: 'state',
                toStorageString: (() => ''),
                expires_in: 1,
                expired: true,
                scopes: ['scopes']
            };
            userManager.setData(testUser);
            service = new AuthService(userManager);

            service.isLoggedInObs().subscribe((loggedin) => {
                expect(loggedin).toBeFalsy();
            });
        });
    });
    describe('startSigninMainWindow', () => {
        it('signinRedirect is called', () => {
            service = new AuthService(userManager);

            service.startSigninMainWindow();
            expect(userManager.signinRedirect).toBeTruthy();
        });
    });
});

export class MockUserManagerEvent {
    addUserLoadedCalled: boolean;
    addUserUnloadedCalled: boolean;

    addUserLoaded() {
        this.addUserLoadedCalled = true;

        return {};
    }

    addUserUnloaded() {
        this.addUserUnloadedCalled = true;

        return {};
    }
}

export class MockUserManager {
    data: any;
    error: any;
    getUserCalled: boolean;
    clearStaleStateCalled: boolean;
    signinRedirectCalled: boolean;
    events = new MockUserManagerEvent();
    addUserLoadedCalled: boolean = this.events.addUserLoadedCalled;
    addUserUnloadedCalled: boolean = this.events.addUserUnloadedCalled;

    getUser() {
        this.getUserCalled = true;

        return this;
    }

    clearStaleState() {
        this.clearStaleStateCalled = true;

        return this;
    }

    signinRedirect() {
        this.signinRedirectCalled = true;

        return this;
    }

    then(callback) {
        if (!this.error) {
            callback(this.data);
        }
        return this;
    }

    catch(callback) {
        if (this.error) {
            callback(this.error);
        }
        return this;
    }

    setData(data) {
        this.data = data;
    }

    setError(error) {
        this.error = error;
    }
}
