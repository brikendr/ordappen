import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";

import { queryToModelOptions } from "./../utils/Conveniences";
import DataFetchError from "./../utils/DataFetchError"
import { DailyWord } from "../models/DailyWord";


@Injectable({
  providedIn: "root"
})
export class DailyWordService {
  private dailywordSnapshot: any;

  subscribeTodaysWord(): Promise<DailyWord> {
    return new Promise((resolve, reject) => {
      this.dailywordSnapshot = firebase.firestore.collection("dailyword").doc("today")
        .onSnapshot((doc) => {
          const options = queryToModelOptions(doc.id, doc.data());
          const dailyWord = new DailyWord(options);
          resolve(dailyWord)
        })
    })
  }

  unsubscribe(): void {
    if (this.dailywordSnapshot) {
      this.dailywordSnapshot();
    }
  }
}
