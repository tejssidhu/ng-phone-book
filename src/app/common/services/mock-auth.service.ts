export class MockAuthService {
    data: any;
    error: any;
    isLoggedInObsCalled: boolean;
    isGetCurrentUserCalled: boolean;

    isLoggedInObs() {
        this.isLoggedInObsCalled = true;

        return this;
    }

    getCurrentUser() {
        this.isGetCurrentUserCalled = true;

        return this;
    }

    subscribe(callback) {
        if (!this.error) {
            callback(this.data);
        }
        return this;
    }

    setData(data) {
        this.data = data;
    }
}
