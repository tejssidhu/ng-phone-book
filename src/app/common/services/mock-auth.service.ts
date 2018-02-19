export class MockAuthService {
    data: any;
    currentUser: any;
    error: any;
    isLoggedInObsCalled: boolean;
    isGetCurrentUserCalled: boolean;
    wasStartSigninMainWindowCalled: boolean;
    wasStartSignoutMainWindowCalled: boolean;

    isLoggedInObs() {
        this.isLoggedInObsCalled = true;

        return this;
    }

    getCurrentUser() {
        this.isGetCurrentUserCalled = true;

        return this;
    }

    startSigninMainWindow() {
        this.wasStartSigninMainWindowCalled = true;
    }

    startSignoutMainWindow() {
        this.wasStartSignoutMainWindowCalled = true;
    }

    subscribe(callback) {
        if (!this.error) {
            callback(this.data);
        }
        return this;
    }
}
