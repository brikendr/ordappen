import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { HomeComponent } from "./home.component";
import { HomeRoutingModule } from "./home-routing.module";
import { DailyWordComponent } from "./dailyword/dailyword.component";
import { NewWordComponent } from "./new/new-word.component";
import { FloatLabel } from "../components/floatlabel.component";
import { NativeScriptFormsModule } from "nativescript-angular";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    DailyWordComponent,
    NewWordComponent,
    FloatLabel
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class HomeModule { }
