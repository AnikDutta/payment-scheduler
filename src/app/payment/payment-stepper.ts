import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
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
  verifiedProfile: Profile;
  retainedPaymentProfile: Profile;
  confirmPayDisabled: boolean = false;

  constructor(private _formBuilder: FormBuilder, private _paymentProfileService : PaymentProfileService) {}

  ngOnInit() {
    this.accountFormGroup = this._formBuilder.group({
      sourceCtrl: ['', Validators.required],
      targetCtrl: ['', Validators.required]
    });
 
    this.paymentFormGroup = this._formBuilder.group({
      amountCtrl: ['', Validators.required],
      payLaterCtrl : ['paynow'],
      transferFrequencyCtrl : [null],
      initiationDateCtrl: [null]
    });
    // this.verifyFormGroup = this._formBuilder.group({
    //   verifyCtrl: ['', Validators.required]
    // });
    this.customer = {id:152493, name:"Dipanjan"};
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
      this.paymentProfile.transaction_frequency_list = newprofile.transaction_frequency_list;
       stepper.next();
    });
   
  }

  private verifyTransaction(stepper){
    this.verifiedProfile = null;
    this.paymentProfile.amount = this.paymentFormGroup.value.amountCtrl;
    
    if(this.paymentFormGroup.value.payLaterCtrl === 'paylater'){
      this.paymentProfile.frequency = this.paymentFormGroup.value.transferFrequencyCtrl;
      this.paymentProfile.initiationDate = this.paymentFormGroup.value.initiationDateCtrl;
    }else{
      this.paymentProfile.frequency = null;
      this.paymentProfile.initiationDate = null;
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
    /*if(radiovalue === 'paynow'){
      this.paymentFormGroup.controls["transferFrequencyCtrl"].reset();
      this.paymentFormGroup.controls["initiationDateCtrl"].reset();
    }*/
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
    stepper.reset();
  }

}
