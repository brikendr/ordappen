import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";

import { Type } from "./../models/type.model";
import { queryToModelOptions } from "./../utils/Conveniences";
import DataFetchError from "./../utils/DataFetchError";

@Injectable({
  providedIn: "root"
})
export class TypeService {
  getAllTypeDocs(): Promise<Array<Type>> {
    return firebase.firestore
      .collection("types")
      .get()
      .then((querySnapshot) => {
        const types: Array<Type> = [];
        querySnapshot.forEach((doc) => {
          const options = queryToModelOptions(doc);
          const type = new Type(options);
          types.push(type);
        });

        return types;
      })
      .catch((error) => {
        throw new DataFetchError(error);
      });
  }
}
