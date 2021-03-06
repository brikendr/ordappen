import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Subscription } from "rxjs";
import { finalize } from "rxjs/operators";
import { Dictionary } from "../shared/models/dictionary.model";
import { DailyWordService } from "../shared/services/dailyword.service";
import { DictionaryService } from "../shared/services/dictionary.service";
import { UserService } from "../shared/services/user.service";
import { DailyWord } from "../shared/models/dailyword.model";
import { backgroundColorCombo } from "../shared/utils/Conveniences";

import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, OnDestroy {
  private _isLoading: boolean = false;
  private _dataSubscription: Subscription;
  private _word: Dictionary;
  private _weeklyWords: Array<Dictionary> = [];
  private _favoriteWords: Array<Dictionary> = [];
  private _randomImageObj: any;

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
                this.fetchWeeklyWords(dailyWord.thisWeek);
                this._randomImageObj = backgroundColorCombo();
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

  async fetchWeeklyWords(wordIdList: Array<string>): Promise<void> {
    const weeklyWords = [];
    for (const wordID of wordIdList) {
      await new Promise((resolve) =>
        this._dictionaryService
          .getWordDetails(wordID)
          .then((word: Dictionary) => {
            weeklyWords.push(word);
            resolve();
          })
      );
    }
    this._weeklyWords = weeklyWords;
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

  get weeklyWords(): Array<Dictionary> {
    return this._weeklyWords;
  }
  get favoriteWords(): Array<Dictionary> {
    return this._favoriteWords;
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
    this._router.navigate([`word/${wordId}`]);
  }

  navigate(path: string): void {
    this._router.navigate([path]).catch((e: any) => {
      TNSFancyAlert.showError(
        "Navigation Error",
        "Navigating to this screen not supported yet!",
        "OK"
      );
    });
  }

  get randomImage(): any {
    return this._randomImageObj;
  }
}
