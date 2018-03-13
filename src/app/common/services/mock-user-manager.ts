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

    signinRedirect() {
        this.signinRedirectCalled = true;

        return this;
    }

    then(callback) {
        if (!this.error) {
            if (callback) {
                callback(this.data);
            }
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