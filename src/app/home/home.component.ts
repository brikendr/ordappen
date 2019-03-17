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

  onButtonTap(): void {
    console.log("Button was presssesssd");
  }

  goToWordDetails(wordId: string): void {
    this._router.navigate([`word/${wordId}`], {
      animated: false
    });
  }

  navigate(path: string): void {
    this._router.navigate([path]);
  }

  get randomImage(): any {
    return this._randomImageObj;
  }
}
