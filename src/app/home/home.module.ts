import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { HomeComponent } from "./home.component";
import { HomeRoutingModule } from "./home-routing.module";
import { DailyWordComponent } from "./dailyword/dailyword.component";
import { NativeScriptFormsModule } from "nativescript-angular";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent, DailyWordComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule {}
