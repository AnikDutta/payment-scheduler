
import { Customer } from './customer';
import { Account } from './account';
import { Frequency } from './frequency';

export class Profile {
    customer: Customer;
    'source-account': Account;
    'target-account': Account;
    'source-account-list' : Account[];
    'target-account-list': Account[];
    frequency: Frequency;
    frequencyList: Frequency[];
    amount: number;
    initiationDate: number;
}