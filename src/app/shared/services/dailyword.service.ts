import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";

import { queryToModelOptions } from "./../utils/Conveniences";
import { DailyWord } from "../models/dailyword.model";

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
          const shouldUpdate = this.checkIfShouldUpdate(dailyWord);
          if (shouldUpdate) {
            this.setShouldUpdateProp(doc.id, shouldUpdate)
            .then(() => resolve(dailyWord))
            .catch((e: any) => reject(e));
          } else {
            resolve(dailyWord);
          }
        });
    });
  }

  checkIfShouldUpdate(dailyWordRef: DailyWord): boolean {
    const currentWordTimestamp = dailyWordRef.addedOn;
    const today = new Date();
    const wordAddedOn = new Date(currentWordTimestamp);
    return (today.getFullYear() + today.getMonth() + today.getDate())
      > (wordAddedOn.getFullYear() + wordAddedOn.getMonth() + wordAddedOn.getDate())
  }

  setShouldUpdateProp (docId: string, value: boolean): Promise<any> {
    return firebase.firestore.collection("dailyword").doc(docId).update({
      should_update: value
    });
  }

  unsubscribe(): void {
    if (this.dailywordSnapshot) {
      this.dailywordSnapshot();
    }
  }
}
