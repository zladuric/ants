import { Http } from 'angular2/http';

export class DataService {

    constructor(http: Http) {
        this.http = http;
    }

    getCustomers() {
        return this.http.get('customers.json');
    }

}

