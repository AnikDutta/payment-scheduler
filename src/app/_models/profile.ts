
import { Customer } from './customer';
import { Account } from './account';
import { Frequency } from './frequency';

export class Profile {
    customer: Customer;
    source_account: Account;
    target_account: Account;
    source_account_list: Account[];
    target_account_list: Account[];
    frequency: Frequency;
    transaction_frequency_list: Frequency[];
    amount: number;
    initiationDate: number;

    constructor(){

    }
}