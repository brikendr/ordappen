import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { LoginComponent } from "./login/login.component";
import { NewWordComponent } from "./new-word/new-word.component";
import { WordComponent } from "./word/word.component";

const routes: Routes = [
  { path: "", redirectTo: "/home/dailyword", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "home", loadChildren: "~/app/home/home.module#HomeModule" },
  { path: "new-word", component: NewWordComponent },
  { path: "word/:id", component: WordComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
