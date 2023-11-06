import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule,  ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {CommonModule, DatePipe, DecimalPipe, registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
//*import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonModule} from 'primeng/button';
import {  IonicRouteStrategy, IonIcon, IonicModule } from '@ionic/angular';






registerLocaleData(localePt);
@NgModule({
  declarations: [AppComponent],
  imports: [
      IonicModule.forRoot(),
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
     //FontAwesomeModule,
     // BrMaskerModule,  
      //FiltroComponentPageModule, 
      ButtonModule, 
      CommonModule
    ],   
    
   
  providers: [
      {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},         
       DatePipe,
       DecimalPipe,
       //ConfirmationService,
       NgxSpinnerService,
      {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
      // MessageService,
      // PdfService,
      {provide: LOCALE_ID, useValue: 'pt-BR'},
      {provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL'},
     // {provide: LOCALE_ID, useValue: "pt"} // could be 'es', 'en', 'fr' or 'ca'
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {

  // constructor(library: FaIconLibrary) { 
	// 	library.addIconPacks();
  // }
  
}
