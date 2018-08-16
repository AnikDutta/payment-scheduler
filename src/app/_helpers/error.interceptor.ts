import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { LoaderService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private loaderService: LoaderService){

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        return next.handle(request).pipe(map((res)=>{this.loaderService.stopLoading(); return res;}),catchError(err => {
            return throwError(err.error);
        }))
    }
}