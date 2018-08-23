import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AlertService {
    private subject = new Subject<any>();

    constructor() {
       
    }

    error(message: any) {
        this.subject.next({ type: 'error', ...message});
    }

    removeError(){
        this.subject.next(null);
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}