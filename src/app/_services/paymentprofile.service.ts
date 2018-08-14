import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Profile } from '../_models';

@Injectable()
export class PaymentProfileService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Profile[]>(`apiurl/users`);
    }
}