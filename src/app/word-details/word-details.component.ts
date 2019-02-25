import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";
import { Page } from "ui/page";
import { Dictionary } from "../shared/models/dictionary.model";
import { DictionaryService } from "../shared/services/dictionary.service";

@Component({
  selector: "WordDetails",
  moduleId: module.id,
  templateUrl: "./word-details.component.html",
  styleUrls: ["./word-details.component.scss"]
})
export class WordDetailsComponent implements OnInit {
  private _word: Dictionary;
  private _isLoading: boolean = false;

  constructor(
    private _dictionaryService: DictionaryService,
    private _router: RouterExtensions,
    private _pageRoute: PageRoute,
    private page: Page
  ) {
    this.page.actionBarHidden = true;
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
            this._word = word;
            this._isLoading = false;
          })
          .catch((e: any) => {
            this._isLoading = false;
          });
      });
  }

  navigateBack() {
    this._router.navigate(["/"], {
      animated: false,
      clearHistory: true
    });
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get word(): Dictionary {
    return this._word;
  }
}
