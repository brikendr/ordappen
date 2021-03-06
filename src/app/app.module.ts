import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { NewWordComponent } from "./new-word/new-word.component";
import { WordComponent } from "./word/word.component";
import { NativeScriptFormsModule } from "nativescript-angular";

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule, NativeScriptFormsModule],
  declarations: [AppComponent, LoginComponent, NewWordComponent, WordComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
