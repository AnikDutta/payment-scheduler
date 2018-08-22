import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Customer, Profile} from '../_models';
import { PaymentProfileService } from '../_services';
import { environment } from '../../environments/environment';
import * as _moment from 'moment';

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
  verifiedProfile: Profile;
  retainedPaymentProfile: Profile;
  confirmPayDisabled: boolean = false;
  nowDate: Date = new Date();

  constructor(private _formBuilder: FormBuilder, private _paymentProfileService : PaymentProfileService) {

  }

  ngOnInit() {
    this.accountFormGroup = this._formBuilder.group({
      sourceCtrl: ['', Validators.required],
      targetCtrl: ['', Validators.required]
    });
 
    this.paymentFormGroup = this._formBuilder.group({
      amountCtrl: ['', Validators.required],
      payLaterCtrl : ['NOW'],
      transferTypeCtrl: ['', Validators.required]
    });
    
    this.customer = environment.customer;
    this.paymentProfile = new Profile();
    this.retainedPaymentProfile = new Profile();

    this.paymentProfile.customer = this.customer;
    this.retainedPaymentProfile.customer = {...this.customer}

    this._paymentProfileService.getSourceAccount(this.paymentProfile).subscribe(newprofile => {
      this.paymentProfile.source_account_list = newprofile.source_account_list;
      this.retainedPaymentProfile.source_account_list = [...newprofile.source_account_list]
    });
  }

  private displayAttributes(stepper){
      this._paymentProfileService.getAttributes(this.paymentProfile).subscribe(newprofile => {
      this.paymentProfile.transfer_frequency_list = newprofile.transfer_frequency_list;
      this.paymentProfile.transfer_scheme_list = newprofile.transfer_scheme_list;
      this.paymentProfile.transfer_type_list= newprofile.transfer_type_list;
      stepper.next();
    });
   
  }

  private verifyTransaction(stepper){
    this.verifiedProfile = null;
    this.paymentProfile.transaction_amount = parseFloat(this.paymentFormGroup.value.amountCtrl);
    this.paymentProfile.transfer_scheme = this.paymentFormGroup.value.payLaterCtrl;
    this.paymentProfile.transfer_type = this.paymentFormGroup.value.transferTypeCtrl;
    if(this.paymentFormGroup.value.payLaterCtrl === 'SCHEDULED'){
      this.paymentProfile.transfer_frequency = this.paymentFormGroup.value.transferFrequencyCtrl;
      this.paymentProfile.transaction_date = _moment(this.paymentFormGroup.value.initiationDateCtrl).format('YYYY-MM-DD');
    }else{
      this.paymentProfile.transfer_frequency = null;
      this.paymentProfile.transaction_date = null;
    }
    console.log(`form Value verifiedprofile------------`, this.paymentProfile);    

    this._paymentProfileService.validateAttributes(this.paymentProfile).subscribe(verifiedprofile => {
      this.verifiedProfile = verifiedprofile;
      stepper.next();
    });

  }

  private sourceAccountChange(selected_source_account){
    this.paymentProfile.target_account_list = [];
    this.accountFormGroup.controls["targetCtrl"].reset();
    this.paymentProfile.source_account = selected_source_account;
    this._paymentProfileService.getTargetAccount(this.paymentProfile).subscribe(newprofile => {
      this.paymentProfile.target_account_list = newprofile.target_account_list;
    });
  }

  private targetAccountChange(selected_target_account){
    this.paymentProfile.target_account = selected_target_account;
  }

  private paymentOptionRadioChange(radiovalue){
    if(radiovalue === 'SCHEDULED'){
      this.paymentFormGroup.addControl('transferFrequencyCtrl',new FormControl('', Validators.required));
      this.paymentFormGroup.addControl('initiationDateCtrl',new FormControl('', Validators.required));
    }else{
      this.paymentFormGroup.removeControl('transferFrequencyCtrl');
      this.paymentFormGroup.removeControl('initiationDateCtrl');
    }
  }
  private getProfile(stepper){
    
    this._paymentProfileService.getProfiles(this.verifiedProfile).subscribe(newprofile => {
      if(newprofile){
        this.confirmPayDisabled = true;
      }else{
        this.confirmPayDisabled = false;
      }
        stepper.next();
    });
  }

  private makeAnotherTransaction(stepper){
    this.paymentProfile = {...this.retainedPaymentProfile};
    this.confirmPayDisabled = false;
    stepper.reset();
    this.paymentFormGroup.controls["payLaterCtrl"].setValue('NOW');
  }

}
