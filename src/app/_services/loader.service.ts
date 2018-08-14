import { Injectable } from '@angular/core';
import {Subject, Observable } from 'rxjs';

@Injectable()
export class LoaderService {
    private subject = new Subject<any>();
    private isLoading = false;
    constructor(){

    }

    startLoading(){
        this.isLoading = true;
        this.subject.next(this.isLoading);
    }

    stopLoading(){
        this.isLoading = false;
        this.subject.next(this.isLoading);
    }
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    getLoadingIndicator():boolean{
        return this.isLoading;
    }
}