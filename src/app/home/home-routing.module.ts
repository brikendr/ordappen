import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { HomeComponent } from "./home.component";
import { DailyWordComponent } from "./dailyword/dailyword.component";
import { NewWordComponent } from "./new/new-word.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      { path: "dailyword", component: DailyWordComponent },
      { path: "new-word", component: NewWordComponent }
    ]
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule {}
