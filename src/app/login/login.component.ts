import { Component, OnInit } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import { topmost } from "ui/frame";
import { RouterExtensions } from "nativescript-angular";
import { UserService } from "../shared/services/user.service";
import { User } from "../shared/models/user.model";

@Component({
  selector: "Login",
  moduleId: module.id,
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  opening = true;

  constructor(
    private _router: RouterExtensions,
    private _userService: UserService
  ) {}

  onGoogleLogin() {
    firebase
      .login({
        type: firebase.LoginType.GOOGLE,
        ios: {
          controller: topmost().ios.controller
        }
      })
      .then((res: any) => {
        const user = new User({ uid: res.uid });
        this._userService
          .createNewUserInstance(user)
          .then(() => {
            this.opening = !this.opening;
            const timeout = setTimeout(() => {
              clearTimeout(timeout);
              this._router.navigate(["/home/dailyword"], {
                animated: false,
                clearHistory: true
              });
            }, 300);
          })
          .catch((docWriteErr: any) => {
            // TODO: give feedback to user
            console.log(docWriteErr);
          });
      })
      .catch((errorMessage: any) => {
        // TODO: give feedback to user
        console.log(errorMessage);
      });
  }
}
