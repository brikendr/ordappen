import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";
import { Page } from "ui/page";
import { Dictionary } from "../shared/models/dictionary.model";
import { DictionaryService } from "../shared/services/dictionary.service";
import { backgroundColorCombo } from "../shared/utils/Conveniences";

const platform = require("tns-core-modules/platform");
@Component({
  selector: "Word",
  moduleId: module.id,
  templateUrl: "./word.component.html",
  styleUrls: ["./word.component.scss"]
})
export class WordComponent implements OnInit {
  isIOS: boolean;
  private _word: Dictionary;
  private _isLoading: boolean = false;
  private _randomImageObj: any;

  constructor(
    private _dictionaryService: DictionaryService,
    private _router: RouterExtensions,
    private _pageRoute: PageRoute,
    private page: Page
  ) {
    page.actionBarHidden = true;

    if (platform.isIOS) {
      this.isIOS = true;
      page.statusBarStyle = "light";
    } else {
      page.backgroundSpanUnderStatusBar = true;
      this.isIOS = false;
    }
  }

  ngOnInit(): void {
    this._isLoading = true;
    this._pageRoute.activatedRoute
      .pipe(switchMap((activatedRoute) => activatedRoute.params))
      .forEach((params) => {
        const wordId = params.id;
        this._dictionaryService
          .getWordDetails(wordId)
          .then((word: Dictionary) => {
            this._randomImageObj = backgroundColorCombo();
            this._word = word;
            this._isLoading = false;
          })
          .catch((e: any) => {
            this._isLoading = false;
          });
      });
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get word(): Dictionary {
    return this._word;
  }

  get randomImage(): any {
    return this._randomImageObj;
  }

  goBack() {
    this._router.back();
  }
}
