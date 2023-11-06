
import { LoginPage } from "./login.page";
import { LoginPageRoutingModule } from "./login-routing.module";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
