import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";

import { queryToModelOptions } from "./../utils/Conveniences";
import { DailyWord } from "../models/DailyWord";

@Injectable({
  providedIn: "root"
})
export class DailyWordService {
  private dailywordSnapshot: any;

  subscribeTodaysWord(userUid: string): Promise<DailyWord> {
    return new Promise((resolve, reject) => {
      this.dailywordSnapshot = firebase.firestore.collection("dailyword").doc(userUid)
        .onSnapshot((doc) => {
          const options = queryToModelOptions(doc);
          const dailyWord = new DailyWord(options);
          resolve(dailyWord);
        });
    });
  }

  unsubscribe(): void {
    if (this.dailywordSnapshot) {
      this.dailywordSnapshot();
    }
  }
}
