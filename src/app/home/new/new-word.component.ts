import { Component, OnInit, ViewChild, ElementRef, } from "@angular/core";
import { action } from "tns-core-modules/ui/dialogs";
import { TypeService } from "~/app/shared/services/type.service";
import { Type } from "~/app/shared/models/type.model";
import { DictionaryService } from "~/app/shared/services/dictionary.service";
import { Dictionary } from "~/app/shared/models/dictionary.model";
import { RouterExtensions } from "nativescript-angular";

@Component({
  selector: "NewWord",
  moduleId: module.id,
  templateUrl: "./new-word.component.html",
  styleUrls: ['./new-word.component.css']
})
export class NewWordComponent implements OnInit {
  description: string = "";
  explanation: string = "";
  level: string = "";
  wordType: string = "";
  usageExample1: string = "";
  usageExample2: string = "";

  private _isProcessing: boolean = false;
  private _types: Array<Type> = [];


  constructor(
    private _typeService: TypeService,
    private _dictionaryService: DictionaryService,
    private routerExtensions: RouterExtensions
  ) { }

  ngOnInit(): void {
    // Load Types
    this._isProcessing = true;
    this._typeService.getAllTypeDocs()
      .then((typeList: Array<Type>) => {
        this._types = typeList;
        this.wordType = typeList[0].name
        this._isProcessing = false;
      }).catch((error: any) => {
        alert('Something went wrong! Sorry!');
        this._isProcessing = false;
      });
  }

  onWordTypeTap(): void {
    var typeDescriptions = this._types.map((item) => {
      return item.name.toUpperCase();
    });

    let options = {
      title: "Ord Type",
      message: "Velg ord type fra listen",
      cancelButtonText: "Cancel",
      actions: typeDescriptions
    };

    action(options).then((result) => {
      this.wordType = (result == 'Cancel') ? this.wordType : result;
    });
  }

  submit() {
    this._isProcessing = true;
    const opts = {
      description: this.description,
      explanation_eng: this.explanation,
      level: this.level,
      type: this.wordType.toLowerCase(),
      usage_examples: [this.usageExample1, this.usageExample2],
      user_id: "JhxYLR3pXWTLglMAoCWs"
    };
    this._dictionaryService.saveNewWord(opts)
      .then(() => {
        this.routerExtensions.navigate(['/'], {
          animated: false,
          clearHistory: true
        });
      }).catch((error: any) => {
        alert('Something went wrong! Sorry!');
        this._isProcessing = false;
      })
  }

  get isProcessing(): boolean {
    return this._isProcessing;
  }
}