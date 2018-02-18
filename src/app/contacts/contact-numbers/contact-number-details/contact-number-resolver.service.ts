import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ContactNumberService } from '../../shared/index';

@Injectable()
export class ContactNumberResolver implements Resolve<any> {
    constructor(private contactNumberService: ContactNumberService) {

    }

    resolve(route: ActivatedRouteSnapshot) {
        return this.contactNumberService.getContactNumber(route.params['id']);
    }
}
