import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { LoginComponent } from "./login/login.component";
import { WordDetailsComponent } from "./word-details/word-details.component";

const routes: Routes = [
  { path: "", redirectTo: "/home/dailyword", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "home", loadChildren: "~/app/home/home.module#HomeModule" },
  { path: "word-details/:id", component: WordDetailsComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
