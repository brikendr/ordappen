import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { finalize } from "rxjs/operators";
import { DailyWordService } from "~/app/shared/services/dailyword.service";
import { DailyWord } from "~/app/shared/models/dailyword.model";
import { DictionaryService } from "~/app/shared/services/dictionary.service";
import { Dictionary } from "~/app/shared/models/dictionary.model";
import { UserService } from "~/app/shared/services/user.service";
import { RouterExtensions } from "nativescript-angular";

const firebase = require("nativescript-plugin-firebase/app");

@Component({
  selector: "DailyWord",
  moduleId: module.id,
  templateUrl: "./dailyword.component.html",
  styleUrls: ["./dailyword.component.scss"]
})
export class DailyWordComponent implements OnInit, OnDestroy {
  private _isLoading: boolean = false;
  private _dataSubscription: Subscription;
  private _word: Dictionary;

  constructor(
    private _dailyWordService: DailyWordService,
    private _dictionaryService: DictionaryService,
    private _userService: UserService,
    private _router: RouterExtensions
  ) {}

  ngOnInit(): void {
    if (!this._dataSubscription) {
      this._isLoading = true;
      this._userService.getUserUid().then((userUid: string) => {
        this._dataSubscription = this._dailyWordService
          .loadDailyWord(userUid)
          .pipe(finalize(() => (this._isLoading = false)))
          .subscribe((dailyWord: DailyWord) =>
            this._dictionaryService
              .getWordDetails(dailyWord.todaysWord)
              .then((word: Dictionary) => {
                this._word = word;
                this._isLoading = false;
              })
              .catch((e: any) => {
                this._isLoading = false;
              })
          );
      });
    }
  }

  ngOnDestroy(): void {
    if (this._dataSubscription) {
      this._dataSubscription.unsubscribe();
      this._dataSubscription = null;
    }
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get word(): Dictionary {
    return this._word;
  }

  getFocusWordSize(wordLength: number) {
    switch (true) {
      case wordLength <= 5:
        return 40;
      case wordLength > 5 && wordLength <= 15:
        return 30;
      case wordLength > 15 && wordLength <= 30:
        return 20;
      default:
        return 10;
    }
  }

  goToWordDetails(wordId: string): void {
    this._router.navigate([`word-details/${wordId}`], {
      animated: false
    });
  }
}
