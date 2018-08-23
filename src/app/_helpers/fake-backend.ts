import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        let transactionInfo: any = {"customer":{"id":300,"name":"Dipanjan"},"source_account_list":[{"id":700,"number":"1000","type":{"id":600,"description":"SAVINGS"},"balance":0,"customer":{"id":300,"name":"DIPANJAN SENGUPTA"},"allow_scheduled_transactions":"Y"},{"id":701,"number":"1001","type":{"id":600,"description":"SAVINGS"},"balance":0,"customer":{"id":300,"name":"DIPANJAN SENGUPTA"},"allow_scheduled_transactions":"N"},{"id":704,"number":"1004","type":{"id":602,"description":"CREDIT"},"balance":0,"customer":{"id":300,"name":"DIPANJAN SENGUPTA"},"allow_scheduled_transactions":"Y"},{"id":705,"number":"1005","type":{"id":602,"description":"CREDIT"},"balance":0,"customer":{"id":300,"name":"DIPANJAN SENGUPTA"},"allow_scheduled_transactions":"N"}],"target_account_list":[{"id":701,"number":"1001","type":{"id":600,"description":"SAVINGS"},"balance":0,"customer":{"id":300,"name":"DIPANJAN SENGUPTA"},"allow_scheduled_transactions":"N"},{"id":702,"number":"1002","type":{"id":601,"description":"MORTGAGE"},"balance":0,"customer":{"id":300,"name":"DIPANJAN SENGUPTA"},"allow_scheduled_transactions":"Y"},{"id":703,"number":"1003","type":{"id":601,"description":"MORTGAGE"},"balance":0,"customer":{"id":300,"name":"DIPANJAN SENGUPTA"},"allow_scheduled_transactions":"N"},{"id":704,"number":"1004","type":{"id":602,"description":"CREDIT"},"balance":0,"customer":{"id":300,"name":"DIPANJAN SENGUPTA"},"allow_scheduled_transactions":"Y"},{"id":705,"number":"1005","type":{"id":602,"description":"CREDIT"},"balance":0,"customer":{"id":300,"name":"DIPANJAN SENGUPTA"},"allow_scheduled_transactions":"N"}],"source_account":{"id":700,"number":"1000","type":{"id":600,"description":"SAVINGS"},"balance":0,"customer":{"id":300,"name":"DIPANJAN SENGUPTA"},"allow_scheduled_transactions":"Y"},"target_account":{"id":701,"number":"1001","type":{"id":600,"description":"SAVINGS"},"balance":0,"customer":{"id":300,"name":"DIPANJAN SENGUPTA"},"allow_scheduled_transactions":"N"},"transfer_frequency_list":[{"id":500,"description":"ONCE"},{"id":501,"description":"WEEKLY"},{"id":502,"description":"MONTHLY"},{"id":503,"description":"BIMONTHLY"},{"id":504,"description":"QUARTERLY"},{"id":505,"description":"LAST FRIDAY OF MONTH"}],"transfer_scheme_list":["NOW","SCHEDULED"],"transfer_type_list":[{"id":400,"description":"SELF-PAY"},{"id":401,"description":"BILL-PAY"},{"id":402,"description":"SURE-PAY"}],"transaction_amount":12,"transfer_scheme":"SCHEDULED","transfer_type":{"id":401,"description":"BILL-PAY"},"transfer_frequency":{"id":501,"description":"WEEKLY"},"transaction_date":"2018-08-29"};

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