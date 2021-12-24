import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class OperatorFormService {

  constructor() { }
  bindFormOperator(): FormGroup {
    return new FormGroup({
      'ID': new FormControl(0),
      'UserID': new FormControl(),
      'OperatorID': new FormControl(),
      'IsTritexOperator': new FormControl(false),
      'IsTrader': new FormControl(false),
      'is2fa': new FormControl(false),
      'LogoFileName': new FormControl(null),
      'Name': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
      'OperatorCode': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])),
      'GroupID': new FormControl(),
      'DomainListID': new FormControl([1], Validators.required),
      'ApprovalUserID': new FormControl(''),
      'UserIDGroup': new FormControl(''),
      'Address': new FormControl('', Validators.compose([Validators.maxLength(250)])),
      'CityName': new FormControl('', Validators.compose([
        Validators.maxLength(20),
      ])),
      'Postcode': new FormControl('', Validators.compose([Validators.maxLength(10)])),
      'CountryID': new FormControl('', Validators.compose([Validators.required])),
      'DefaultPricingCurrencyID': new FormControl('', Validators.required),
      'TAPBillingCurrencyID': new FormControl('', Validators.required),
      'DecimalPoints': new FormControl(6, Validators.required),
      'SigningMethodID': new FormControl('', Validators.required),
      'UserIDIndividual': new FormControl(''),
      'DataClearingHouse': new FormControl(12, Validators.required),
      'FinancialClearingHouse': new FormControl(13, Validators.required),
      'IotContractTemplateID': new FormControl([1], Validators.required),
      'NBIotContractTemplateID': new FormControl([]),
      'MIotContractTemplateID': new FormControl([]),
      // 'SignatureAuthorised': new FormControl(),   
      'CustomCountryID': new FormControl(''),
      'ChargeableMenuID': new FormControl([]),
      'OperatorTadigCodeList': new FormArray([]),
      'EscalationList': new FormArray([]),
      'CustomizableCountries': new FormControl(),
      'ThirdPartyEnumID': new FormControl('')
    });
  }

}

