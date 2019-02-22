import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";

import { queryToModelOptions } from "./../utils/Conveniences";
import DataFetchError from "./../utils/DataFetchError";
import { Dictionary } from "../models/dictionary.model";

@Injectable({
  providedIn: "root"
})
export class DictionaryService {
  getWordDetails(docRefId): Promise<Dictionary> {
    return firebase.firestore
      .collection("dictionary")
      .doc(docRefId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const opts = queryToModelOptions(doc);
          const dictionaryWord = new Dictionary(opts);

          return dictionaryWord;
        } else {
          return undefined;
        }
      })
      .catch((error) => {
        throw new DataFetchError(error);
      });
  }

  saveNewWord(wordOpts: any) {
    return firebase.firestore
      .collection("dictionary")
      .add(wordOpts)
      .then((docRef: any) => {
        return Promise.resolve();
      })
      .catch((error: any) => {
        throw new Error(error);
      });
  }
}

export interface Item {
  id: number;
  description: string;
  explanation: string;
  level: string;
  usage: string;
}
