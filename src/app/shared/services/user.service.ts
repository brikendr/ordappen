import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import { User } from "./../models/user.model";
import DataFetchError from "../utils/DataFetchError";
import { queryToModelOptions } from "../utils/Conveniences";

@Injectable({
  providedIn: "root"
})
export class UserService {
  isUserLoggedIn(): Promise<boolean> {
    return new Promise((resolve) =>
      firebase
        .getCurrentUser()
        .then((user) => {
          console.log("User uid: " + user.uid);
          console.log(user);
          resolve(true);
        })
        .catch((error) => {
          console.log("Trouble in paradise: " + error);
          resolve(false);
        })
    );
  }

  getUserUid(): Promise<string> {
    return firebase
      .getCurrentUser()
      .then((user: any) => {
        return user.uid;
      })
      .catch((err) => {
        throw new Error("User is not logged in!");
      });
  }

  logOut(): void {
    firebase.logout();
  }

  createNewUserInstance(user: User) {
    return firebase.firestore
      .collection("users")
      .doc(user.googleUserUid)
      .set(user.toDocEntries())
      .then((docRef: any) => {
        return Promise.resolve();
      })
      .catch((error: any) => {
        throw new Error(error);
      });
  }

  getFirestoreUser(): Promise<User> {
    return this.getUserUid().then((uid: string) => {
      return firebase.firestore
        .collection("users")
        .doc(uid)
        .get()
        .then((userDoc) => {
          if (userDoc.exists) {
            const opts = queryToModelOptions(userDoc);

            return new User(opts);
          } else {
            return undefined;
          }
        })
        .catch((error) => {
          throw new DataFetchError(error);
        });
    });
  }
}
