import { Component, OnInit } from "@angular/core";
import { initFirebase } from "./shared/firebase.common";
import * as statusBar from 'nativescript-status-bar'

@Component({
	moduleId: module.id,
	selector: "ns-app",
	templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
	ngOnInit() {
		initFirebase();
		statusBar.hide();
	}
}
