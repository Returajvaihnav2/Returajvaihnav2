import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { AlfrescoMiddlewareApiService } from './services/alfresco-middleware-api.service';
import { SpinnerService } from './services/spinner.service';
import { HttpErrorHandler } from './services/http-error-handler.service';
import { LoggerService } from './services/log4ts/logger.service';
import { CookieService } from 'ngx-cookie-service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { UtilityProvider } from './utility/utility';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderService } from '@alfresco/adf-core';
import { AuthService } from './services/authentication/auth.service';
import { HostService } from './services/host/host.service';
import { WINDOW_PROVIDERS } from './services/host/window.provider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagenotfoundComponent } from './views/pagenotfound/pagenotfound.component';
import { AuthGuardService } from './services/authentication/auth-guard.service';
import { MaterialRefModule } from './material.module';
@NgModule({
  declarations: [
    AppComponent,
    PagenotfoundComponent
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
     FormsModule,
    HttpClientModule ,
    NgIdleKeepaliveModule.forRoot(),
    ModalModule.forRoot(),
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: TranslateLoaderService }
    }),
    MaterialRefModule,
    
  ],
  providers: [ ApiService,
    AlfrescoMiddlewareApiService,
    SpinnerService,
    HttpErrorHandler,
    LoggerService,
    CookieService,
    UtilityProvider,
    AuthService,
    HostService,
    WINDOW_PROVIDERS,
      AuthGuardService
      ],
  bootstrap: [AppComponent]
})
export class AppModule { }
