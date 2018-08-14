import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Customer, Profile} from '../_models';
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
  constructor(private _formBuilder: FormBuilder) {}

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
    //this.paymentProfile.customer = this.customer;
    console.log(`paymentProfile---------------`+this.paymentProfile);
  }

  private displayAttributes(stepper){
    console.log(`stepper object 1----------`, stepper);
    stepper.next();
  }

  private verifyTransaction(stepper){
    console.log(`stepper object 2----------`, stepper);
    stepper.next();
  }



}
