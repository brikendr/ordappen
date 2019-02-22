import { Injectable, NgZone } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { queryToModelOptions } from "./../utils/Conveniences";
import { DailyWord } from "../models/dailyword.model";

@Injectable({
  providedIn: "root"
})
export class DailyWordService {
  constructor(private _ngZone: NgZone) {}

  loadDailyWord(userUid: string) {
    return new Observable((subscriber: any) => {
      firebase.firestore
        .collection("dailyword")
        .doc(userUid)
        .onSnapshot((doc: any) => {
          this._ngZone.run(async () => {
            const options = queryToModelOptions(doc);
            const dailyWord = new DailyWord(options);
            const shouldUpdate = this.checkIfShouldUpdate(dailyWord);
            if (shouldUpdate) {
              await this.setShouldUpdateProp(doc.id, shouldUpdate);
            }
            subscriber.next(dailyWord);
          });
        });
    }).pipe(catchError(this.handleErrors));
  }

  checkIfShouldUpdate(dailyWordRef: DailyWord): boolean {
    const currentWordTimestamp = dailyWordRef.addedOn;
    const today = new Date();
    const wordAddedOn = new Date(currentWordTimestamp);

    return (
      today.getFullYear() + today.getMonth() + today.getDate() >
      wordAddedOn.getFullYear() + wordAddedOn.getMonth() + wordAddedOn.getDate()
    );
  }

  setShouldUpdateProp(docId: string, value: boolean): Promise<any> {
    return firebase.firestore
      .collection("dailyword")
      .doc(docId)
      .update({
        should_update: value
      });
  }

  private handleErrors(error: Response): Observable<never> {
    return throwError(error);
  }
}
