import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { action } from "tns-core-modules/ui/dialogs";
import { TypeService } from "~/app/shared/services/type.service";
import { Type } from "~/app/shared/models/type.model";
import { DictionaryService, Item } from "~/app/shared/services/dictionary.service";
import { Dictionary } from "~/app/shared/models/dictionary.model";
import { RouterExtensions } from "nativescript-angular";

import { screen, isIOS } from "platform";
import * as utils from "utils/utils";
import * as frame from "ui/frame";
import { UserService } from "~/app/shared/services/user.service";
import { User } from "~/app/shared/models/user.model";

declare let UIView;

@Component({
  selector: "NewWord",
  moduleId: module.id,
  templateUrl: "./new-word.component.html",
  styleUrls: ["./new-word.component.scss"]
})
export class NewWordComponent implements OnInit {
  @ViewChild('container') container: ElementRef;

  item: Item;
  orderTaker: number = 0;
  currentDetailType: string = "description";
  halfScreenHeight = (screen.mainScreen.heightDIPs / 2) - 100;
  halfScreenWidth = (screen.mainScreen.widthDIPs / 2) - 40;
  prevDeltaX: number = 0;
  defaultPersonX: 0;
  wordType: string = "";


  private _isProcessing: boolean = false;
  private _types: Array<Type> = [];

  constructor(
    private _typeService: TypeService,
    private _dictionaryService: DictionaryService,
    private _userService: UserService,
    private routerExtensions: RouterExtensions
  ) { }

  ngOnInit(): void {
    // Load Types
    this.setDefaultItem();
    this._isProcessing = false;
    this._typeService.getAllTypeDocs()
      .then((typeList: Array<Type>) => {
        this._types = typeList;
        this.wordType = typeList[0].name;
        this._isProcessing = false;
        // this.container.nativeElement.translateY = this.halfScreenHeight;
      }).catch((error: any) => {
        alert("Something went wrong! Sorry!");
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
      this.wordType = (result === "Cancel") ? this.wordType : result;
    });
  }

  submit(item: Item) {
    this._isProcessing = true;
    this._userService.getFirestoreUser().then((user: User) => {
      const opts = {
        description: this.item.description,
        explanation_eng: this.item.explanation,
        level: this.item.level,
        type: this.wordType.toLowerCase(),
        examples: this.mapWordExamples(user, this.item.usage.split(';')),
        user_id: user.googleUserUid
      };
      this._dictionaryService.saveNewWord(opts)
        .then(() => {
          this.routerExtensions.navigate(["/"], {
            animated: false,
            clearHistory: true
          });
        }).catch((error: any) => {
          alert("Something went wrong! Sorry!");
          this._isProcessing = false;
        });
    }).catch((err: any) => {
      this.routerExtensions.navigate(["/login"], {
        clearHistory: true
      });
    })
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
    this.item = <any>{
      id: null,
      description: '',
      explanation: '',
      level: '',
    };
  }

  selectItemDetail(inputItem, selectedDetail) {
    let tmpHeight = this.halfScreenHeight;
    console.log('tmpHeight Is: ', tmpHeight);
    let currentHeight = {
      'description': 0,
      'explanation': -(tmpHeight / 4),
      'level': -(tmpHeight / 2),
      'examples': -(tmpHeight + (isIOS ? 10 : 30)),
      'type': -(tmpHeight + (isIOS ? 110 : 130))
    };

    if (this.currentDetailType === selectedDetail) {
      return;
    }

    this.currentDetailType = selectedDetail;

    if (inputItem && selectedDetail !== 'type') {
      if (isIOS) {
        inputItem.ios.inputAccessoryView = UIView.alloc().init();
      }
      inputItem.focus();
    } else {
      this.dismissSoftKeybaord();
    }
    this.container.nativeElement.animate({
      translate: { x: 0, y: currentHeight[selectedDetail] },
      duration: 200
    });
  }

  dismissSoftKeybaord() {
    if (isIOS) {
      frame.topmost().nativeView.endEditing(true);
    } else {
      utils.ad.dismissSoftInput();
    }
  }

  isSelected(name) {
    return this.currentDetailType === name;
  }
}
