import { Customer } from './customer';
import { AccountType } from './accounttype';
export class Account{
    id: number;
    number: string;
    type: AccountType;
    balance: number;
    customer: Customer;
    allow_scheduled_transactions: string;
}