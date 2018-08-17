
import { Customer } from './customer';
import { Account } from './account';
import { Frequency } from './frequency';
import { TransferType } from './transfertype';

export class Profile {
    customer: Customer;
    source_account: Account;
    target_account: Account;
    source_account_list: Account[];
    target_account_list: Account[];
    frequency: Frequency;
    transfer_frequency_list: Frequency[];
    amount: number;
    initiationDate: any;
    transfer_scheme_list : any[];
    transfer_scheme: string;
    transfer_type_list: TransferType[];
    transfer_type: TransferType;
    constructor(){

    }
}