import { AuthenticationService } from '@alfresco/adf-core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { HostService } from 'src/app/services/host/host.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user/user.service';
import { BrowserStorageService } from 'src/app/utility/browser-storage.service';
import { UtilityProvider } from 'src/app/utility/utility';
import { environment } from 'src/environments/environment';
import { UniversalValidators } from 'ngx-validators';
import { Constants } from 'src/app/constants/app.constants';
import { ApiService } from 'src/app/services/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SnackBarWarningComponent } from 'src/app/partialviews/snack-bar-warning/snack-bar-warning.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup=new FormGroup({});
  public permissions = [];
  loginSuccessReceived: Boolean = false;
  public isFormSubmitted = false;
  public validEmailError: any = false;
  public logo :any;
  public background : any;
  message:any;
  ResponseStatus: any;
  isSuccessMessage = false;
  intervalId: any;
  accountLocked = false;
  viewPasswordData:boolean = false;
  redirectURL: any;
  constructor( private formBuilder: FormBuilder,
    private router: Router,
    private alfAuthuthService: AuthenticationService,
    private browserStorageService: BrowserStorageService,
    public activatedRoute: ActivatedRoute,
    private userService: UserService,
    private apiService: ApiService,
    private spinner: SpinnerService,
    private idle: Idle,
    private utility: UtilityProvider,
    private authService: AuthService,
    public hostService: HostService,
    private _snackBar: MatSnackBar
    ) {
      let params = this.activatedRoute.snapshot.queryParams;
      if (params['redirectURL']) {
        this.redirectURL = atob(params['redirectURL']);
      }
     }

    
ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['',
      Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
 
    this.hostService.getLoginLogo().then((data) => {
    
      this.logo = data;
     this.logo ="../../../../../assets/img/viewer-logo.png";
    });
  
    this.hostService.getBackground().then((data) => {
      this.background = data;
    });
}

isTritexDomain() {
  return this.hostService.getHostname() === 'tritexsolutions.com';
}

loginSuccess() {
  const userDetails=this.userService.getuserData();
  Promise.all([userDetails])
    .then(() => {
      this.idle.watch();
      this.toggleSpinner(true);
      if (this.userService.passChangeReq === 1) {
        this.router.navigate(['auth', 'reset-password', 'force']);
      } else {
        if (this.redirectURL) {
          this.router.navigateByUrl(this.redirectURL)
            .catch(() => this.router.navigate(['admin/dashboard/' + new Date().getTime()]));
        } else {
          this.router.navigate(['admin/dashboard/' + new Date().getTime()]);
        }

      }
    }).catch(err => {
      this.toggleSpinner(false);
      this.authService.logout();
    });


}



getTritexToken(userData:any) {
  return new Promise((resolve, reject) => {
     const data = {
      'userName': userData.userName,
      'password': userData.password
    };
    this.authService.getTritexToken(data).then(tokenRes => {
      this.userService.saveUserActivityLog(Constants.USER_ACTIVITIES.USER.NAME, Constants.NO_COMMENTS,
        Constants.USER_ACTIVITIES.OPERATIONS.LOGIN, Constants.NO_COMMENTS);
      return resolve(true);
    }).catch(err => {
      this.userService.saveUserActivityLog(Constants.USER_ACTIVITIES.USER.NAME, Constants.NO_COMMENTS,
        Constants.USER_ACTIVITIES.OPERATIONS.LOGIN, Constants.ERROR);
      this.toggleSpinner(false);
      this.authService.logout();
      return reject(false);
    });
  });
}

str_pad_left(string:any, pad:any, length:any) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}

forgotPassword() {
  if (this.redirectURL) {
    this.router.navigate(['/auth/forgot-password'], { queryParams: { 'redirectURL': btoa(this.redirectURL) } });
  } else {
    this.router.navigate(['/auth/forgot-password']);
  }

}

handleReset() {

}

handleExpire() {
  this.isSuccessMessage = false;
  this.showPopup('', 'reCaptcha expired please fill again.', 'error');
  this.loginForm.get('recaptcha')?.setValue('');
}


// convenience getter for easy access to form fields
get loginControls() { return this.loginForm.controls; }

toggleSpinner(display:any) {
  this.apiService.isSpinner = !display;
  this.spinner.displaySpinner(display);
}

login() {
  this.toggleSpinner(true);
  this.isFormSubmitted = true;
  const formValues = this.loginForm.value;
  if (this.loginForm.valid) {
    const data = {
      'username': formValues.userName,
      'password': formValues.password,
      'domain': this.hostService.getHostname()
    };
    this.authService.userName = formValues.userName;
    this.loginCall();  
    
  } else {
    this.toggleSpinner(false);
    this.showPopup('', 'Please enter valid Username/Password/', 'error');
  }
}
getTritexLogin(data){
  return new Promise((resolve, reject) => {
  this.getTritexToken({
    'userName':'bhavin.patel@tritexsolutions.com',
    'password': 'BEC752B2-7D07-4BBD-83B4-AA7C8CC8844B'
  }).then(res => {
    return resolve(true);
  }).catch(err => {
    return reject(false);
  });
});
}

submit() {
  const hostname = this.browserStorageService.getLocalStorageItem('DomainName');
  if (!hostname) {
    this.hostService.getLogo().then(() => {
      this.login();
    }).catch((err) => {
      console.error(err);
      this.toggleSpinner(false);
      this.showPopup('', 'Please enter valid Username/Password.', 'error');
    });
  } else {
    this.login();
  }

}

loginCall() {
  const formValues = this.loginForm.value;
  const data = {
    'username': formValues.userName,
    'password': formValues.password,
    //'otp': formValues.otp ? formValues.otp : '------'
  };
this.getTritexLogin(data).then(res=>{
  this.loginSuccess();
}).catch((er)=>{
  console.log(er);
})
  
}

viewPassword() {
  this.viewPasswordData = !this.viewPasswordData;
}


showPopup(title:any, text:any, type:any, redirectToLogin:any = false) {

  if (redirectToLogin) {
    this.utility.displaySwalPopup(title, text, type).then((res:any) => {
      this.accountLockedRedirect();
    });
  } else {
    this.utility.displaySwalPopup(title, text, type)
  }
}
openSnackBar(appsnackbarwarning:any) {
  // this._snackBar.openFromComponent(appsnackbarwarning, {
  //   duration: 1500,
  //   horizontalPosition:'right',
  //   verticalPosition:'top',
  //   panelClass:['red-snackbar'],
    
  // });
  this._snackBar.open("Invalid Login Credentials", "Try again!", {
    duration: 3000,
    horizontalPosition:'right',
    verticalPosition:'top',
    panelClass: ['red-snackbar','login-snackbar'],
    });
}

accountLockedRedirect() {

  this.permissions = [];
  this.loginSuccessReceived = false;
  this.isFormSubmitted = false;
  this.validEmailError = false;
  this.message = '';
  this.ResponseStatus = '';
  this.isSuccessMessage = false;
  this.intervalId = null;
  this.accountLocked = false;
  this.viewPasswordData = false;
  this.ngOnInit();
  this.router.navigate(['auth', 'login', new Date().getTime()]);
}


getUrl() {
  return "url('" + this.background + "')";
}
}


