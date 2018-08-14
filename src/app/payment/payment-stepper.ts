import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Customer, Profile} from '../_models';
import { PaymentProfileService } from '../_services';

/**
 * @title Payment Stepper
 */
@Component({
  selector: 'payment-stepper',
  templateUrl: 'payment-stepper.html',
  styleUrls: ['payment-stepper.css'],
})
export class PaymentStepper implements OnInit {
  isLinear = false;
  accountFormGroup: FormGroup;
  paymentFormGroup: FormGroup;
  verifyFormGroup: FormGroup;
  customer: Customer;
  paymentProfile: Profile;
  target_account_model = '';
  constructor(private _formBuilder: FormBuilder, private _paymentProfileService : PaymentProfileService) {}

  ngOnInit() {
    this.accountFormGroup = this._formBuilder.group({
      sourceCtrl: ['', Validators.required],
      targetCtrl: ['', Validators.required]
    });
    this.paymentFormGroup = this._formBuilder.group({
      amountCtrl: ['', Validators.required]
    });
    this.verifyFormGroup = this._formBuilder.group({
      verifyCtrl: ['', Validators.required]
    });
    this.customer = {id:152493, name:"Dipanjan"};
    console.log(`customer---------------`,this.customer);
    this.paymentProfile = new Profile();
    this.paymentProfile.customer = this.customer;
    console.log(`paymentProfile---------------`,this.paymentProfile);
    this._paymentProfileService.getSourceAccount(this.paymentProfile).subscribe(newprofile => {
      this.paymentProfile.source_account_list = newprofile.source_account_list;
      console.log(`paymentProfile---------------`,this.paymentProfile);

    });
  }

  private displayAttributes(stepper){
    console.log(`stepper object 1----------`, stepper);
    stepper.next();
  }

  private verifyTransaction(stepper){
    console.log(`stepper object 2----------`, stepper);
    stepper.next();
  }

  private sourceAccountChange(source_id){
    this.paymentProfile.target_account_list = [];
    this.target_account_model = '';
    let selected_source_account = this.paymentProfile.source_account_list.filter(source_account =>{
      return source_account.id == source_id;
    });
    this.paymentProfile.source_account = selected_source_account[0];
    console.log(`selected source-----------`,this.paymentProfile);
   
    this._paymentProfileService.getTargetAccount(this.paymentProfile).subscribe(newprofile => {
      this.paymentProfile.target_account_list = newprofile.target_account_list;
      console.log(`paymentProfile for Target---------------`,this.paymentProfile);

    });
  }

  private targetAccountChange(target_id){
   
    let selected_target_account = this.paymentProfile.target_account_list.filter(target_account =>{
      return target_account.id == target_id;
    });
    this.paymentProfile.target_account = selected_target_account[0];
    console.log(`selected target-----------`,this.paymentProfile);
  }

}
