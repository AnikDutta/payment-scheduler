import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        let transactionInfo: any = {"customer":{"id":300,"name":"Dipanjan"},"source_account":{"id":100,"number":"1234567890","type":{"description":"savings"}},"target_account":{"id":200,"number":"0987654321","type":{"description":"mortgage"}},"source_account_list":[{"id":100,"number":"1234567890","type":{"description":"savings"}},{"id":101,"number":"1234567999","type":{"description":"savings"}},{"id":102,"number":"982879283789","type":{"description":"savings"}}],"target_account_list":[{"id":200,"number":"0987654321","type":{"description":"mortgage"}},{"id":201,"number":"09876543456","type":{"description":"mortgage"}},{"id":202,"number":"0987654987","type":{"description":"mortgage"}}],"transfer_type_list":[{"id":100,"description":"self-pay"},{"id":200,"description":"sure-pay"},{"id":300,"description":"bill-pay"}],"transfer_frequency_list":[{"id":100,"description":"daily"},{"id":200,"description":"weekly"},{"id":300,"description":"monthly"}],"transfer_scheme_list":["NOW","SCHEDULE"]};

        let error: any = {
                "timestamp" : "Friday August 2018-08-17 16:30:42.926+0530",
                "status" : 400,
                "error" : "Bad Request",
                "message" : "Validation failed for: demo.acme.model.Profile@51d5fd75[customer=demo.acme.model.Customer@5937e726[id=152493,name=Dipanjan],sourceAccount=demo.acme.model.Account@4434692a[id=100,number=1234567890,type=demo.acme.model.AccountType@59d72618[id=<null>,description=savings],balance=<null>,customer=<null>,allowScheduledTransactions=Y],targetAccount=demo.acme.model.Account@7d75956c[id=200,number=0987654321,type=demo.acme.model.AccountType@201a21c5[id=<null>,description=mortgage],balance=<null>,customer=<null>,allowScheduledTransactions=<null>],sourceAccountList=[demo.acme.model.Account@7c892e0b[id=100,number=1234567890,type=demo.acme.model.AccountType@46711528[id=<null>,description=savings],balance=<null>,customer=<null>,allowScheduledTransactions=Y]],targetAccountList=[demo.acme.model.Account@26f61c18[id=200,number=0987654321,type=demo.acme.model.AccountType@5713050a[id=<null>,description=mortgage],balance=<null>,customer=<null>,allowScheduledTransactions=<null>]],transferType=demo.acme.model.TransferType@2328391d[id=200,description=sure-pay],transferTypeList=[demo.acme.model.TransferType@62df9095[id=100,description=self-pay], demo.acme.model.TransferType@2cc901b3[id=200,description=sure-pay], demo.acme.model.TransferType@3a49ceee[id=300,description=bill-pay]],scheme=SCHEDULED,schemeList=[NOW, SCHEDULED],frequency=<null>,frequencyList=[demo.acme.model.Frequency@6b78caf2[id=100,description=daily], demo.acme.model.Frequency@fd88ab7[id=200,description=weekly], demo.acme.model.Frequency@7b121b1c[id=300,description=monthly]],amount=<null>,initiationDate=<null>] errors: [property: amount; value: null; constraint: transfer amount cannot be null; ]. Exchange[ID-LT045362-1534503595935-0-17]",
                "path" : "http://10.227.88.31:8080/transfer-composite/attributes/validate"
            }
        let profile : any = {"id":"100"};
        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (/*request.url.endsWith('/accounts/source') && */request.method === 'POST') {
                // find if any user matches login credentials
                
                if(request.body.customer && request.body.customer.id === transactionInfo.customer.id && request.url.endsWith('/profiles')){
                    let body = profile;

                    return of(new HttpResponse({ status: 200, body: body }));
                    //return throwError(error);
                }
                else if (request.body.customer && request.body.customer.id === transactionInfo.customer.id ) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    let body = transactionInfo;

                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    // else return 400 bad request
                    return throwError(error);
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