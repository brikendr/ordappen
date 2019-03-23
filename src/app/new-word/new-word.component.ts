import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { action } from "tns-core-modules/ui/dialogs";
import { TypeService } from "~/app/shared/services/type.service";
import { Type } from "~/app/shared/models/type.model";
import {
  DictionaryService,
  Item
} from "~/app/shared/services/dictionary.service";
import { RouterExtensions } from "nativescript-angular";

import { screen, isIOS } from "platform";
import * as utils from "utils/utils";
import * as frame from "ui/frame";
import { UserService } from "~/app/shared/services/user.service";
import { User } from "~/app/shared/models/user.model";
import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";

declare let UIView;

@Component({
  selector: "NewWord",
  moduleId: module.id,
  templateUrl: "./new-word.component.html",
  styleUrls: ["./new-word.component.scss"]
})
export class NewWordComponent implements OnInit {
  @ViewChild("container") container: ElementRef;
  currentSelectedItem: string = "";

  /* Properties */
  descriptionTxt: string = "";
  explanationTxt: string = "";
  levelTxt: string = "";
  usageExamples: Array<string> = [];
  wordType: string = "";

  private _isProcessing: boolean = false;
  private _types: Array<Type> = [];

  constructor(
    private _typeService: TypeService,
    private _dictionaryService: DictionaryService,
    private _userService: UserService,
    private routerExtensions: RouterExtensions
  ) {}

  ngOnInit(): void {
    // Load Types
    this.setDefaultItem();
    this._isProcessing = false;
    this._typeService
      .getAllTypeDocs()
      .then((typeList: Array<Type>) => {
        this._types = typeList;
        this.wordType = typeList[0].name.toUpperCase();
        this._isProcessing = false;
        // this.container.nativeElement.translateY = this.halfScreenHeight;
      })
      .catch((error: any) => {
        TNSFancyAlert.showError(
          "Error!",
          "Something went wrong! Try again later.",
          "Close"
        );
        this._isProcessing = false;
      });
  }

  onWordTypeTap(): void {
    const typeDescriptions = this._types.map((item) => {
      return item.name.toUpperCase();
    });

    const options = {
      title: "Ord Type",
      message: "Velg ord type fra listen",
      cancelButtonText: "Cancel",
      actions: typeDescriptions
    };

    action(options).then((result) => {
      this.wordType = result === "Cancel" ? this.wordType : result;
    });
  }

  submit() {
    this._isProcessing = true;
    this._userService
      .getFirestoreUser()
      .then((user: User) => {
        const opts = {
          description: this.descriptionTxt,
          explanation_eng: this.explanationTxt,
          level: this.levelTxt,
          type: this.wordType.toLowerCase(),
          examples: this.mapWordExamples(user, this.usageExamples),
          user_id: user.googleUserUid
        };
        this._dictionaryService
          .saveNewWord(opts)
          .then(() => {
            TNSFancyAlert.showSuccess(
              "Success!",
              "The new word was added to the dictionary",
              "OK"
            );
            this.routerExtensions.navigate(["/"], {
              animated: false,
              clearHistory: true
            });
          })
          .catch((error: any) => {
            TNSFancyAlert.showError(
              "Error!",
              "Something went wrong! Try again later.",
              "Close"
            );
            this._isProcessing = false;
          });
      })
      .catch((err: any) => {
        this.routerExtensions.navigate(["/login"], {
          clearHistory: true
        });
      });
  }

  mapWordExamples(user: User, usageExamples: Array<string>): any {
    const examplesMap = [];
    usageExamples.forEach((element) => {
      examplesMap.push({
        added_by: user.googleUserUid,
        approved: user.writePriviledges,
        description: element
      });
    });

    return examplesMap;
  }

  get isProcessing(): boolean {
    return this._isProcessing;
  }

  setDefaultItem() {
    this.descriptionTxt = "";
    this.explanationTxt = "";
    this.levelTxt = "";
    this.usageExamples = [];
  }

  dismissSoftKeybaord() {
    if (isIOS) {
      frame.topmost().nativeView.endEditing(true);
    } else {
      utils.ad.dismissSoftInput();
    }
  }

  selectItemDetail(inputItem, selectedDetail) {
    if (this.currentSelectedItem === selectedDetail) {
      return;
    }

    this.currentSelectedItem = selectedDetail;

    if (
      inputItem &&
      selectedDetail !== "ctype" &&
      selectedDetail !== "examples"
    ) {
      if (isIOS) {
        inputItem.ios.inputAccessoryView = UIView.alloc().init();
      }
      inputItem.focus();
    } else {
      this.dismissSoftKeybaord();
    }
  }

  isSelected(name) {
    return this.currentSelectedItem === name;
  }

  openExampleModal() {
    const initialValue = null;
    TNSFancyAlert.showTextField(
      "Usage Example",
      initialValue,
      new TNSFancyAlertButton({
        label: "Save",
        action: (value: any) => {
          if (value !== "") {
            this.usageExamples.push(value);
          }
        }
      }),
      undefined,
      "#FF7761",
      "Add example!",
      `Write an example where you showcase the word usage`,
      undefined,
      undefined,
      300
    );
  }
}
