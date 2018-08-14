import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Profile } from '../_models';

@Injectable()
export class PaymentProfileService {
    constructor(private http: HttpClient) { }

    getSourceAccount(profile: Profile) {
        return this.http.post<Profile>(`${environment.apiUrl}/accounts/source`,profile);
    }
    getTargetAccount(profile: Profile) {
        return this.http.post<Profile>(`${environment.apiUrl}/accounts/target`,profile);
    }
    getAttributes(profile: Profile) {
        return this.http.post<Profile>(`${environment.apiUrl}/attributes/display`,profile);
    }
    validateAttributes(profile: Profile) {
        return this.http.post<Profile>(`${environment.apiUrl}/attributes/validate`,profile);
    }
    getProfiles(profile: Profile) {
        return this.http.post<Profile>(`${environment.apiUrl}"/profiles"`,profile);
    }
}