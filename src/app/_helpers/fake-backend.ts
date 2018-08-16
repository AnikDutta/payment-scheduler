import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        let profile: any = {"customer":{"id":152493,"name":"Dipanjan"},"source_account":{"id":100,"number":"1234567890","type":{"description":"savings"}},"target_account":{"id":200,"number":"0987654321","type":{"description":"mortgage"}},"source_account_list":[{"id":100,"number":"1234567890","type":{"description":"savings"}},{"id":101,"number":"1234567999","type":{"description":"savings"}},{"id":102,"number":"982879283789","type":{"description":"savings"}}],"target_account_list":[{"id":200,"number":"0987654321","type":{"description":"mortgage"}},{"id":201,"number":"09876543456","type":{"description":"mortgage"}},{"id":202,"number":"0987654987","type":{"description":"mortgage"}}],"transfer_type_list":[{"id":100,"description":"self-pay"},{"id":200,"description":"sure-pay"},{"id":300,"description":"bill-pay"}],"transaction_frequency_list":[{"id":100,"description":"daily"},{"id":200,"description":"weekly"},{"id":300,"description":"monthly"}]};

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (/*request.url.endsWith('/accounts/source') && */request.method === 'POST') {
                // find if any user matches login credentials
                

                if (request.body.customer && request.body.customer.id === 152493) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    let body = profile;

                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    // else return 400 bad request
                    return throwError({ error: { message: 'No Account Available' } });
                }
            }


            // pass through any requests not handled above
            return next.handle(request);
            
        }))

        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};