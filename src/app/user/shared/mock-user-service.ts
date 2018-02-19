export class MockUserService {
    data: any;
    error: any;
    getUserCalledWithId: String;
    createUserCalledWithObj: any;
    wasCreateUserCalled: boolean;
    wasGetUserCalled: boolean;


    getUser(id: String) {
        this.wasGetUserCalled = true;
        this.getUserCalledWithId = id;

        return this;
    }

    createUser(user: any) {
        this.wasCreateUserCalled = true;
        this.createUserCalledWithObj = user;

        return this;
    }

    subscribe(callback) {
        if (!this.error) {
            callback(this.data);
        }
        return this;
    }
}
