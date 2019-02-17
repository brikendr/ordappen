import { Component, OnInit, OnDestroy } from "@angular/core";
import { DailyWordService } from "~/app/shared/services/dailyword.service";
import { DailyWord } from "~/app/shared/models/DailyWord";
import { DictionaryService } from "~/app/shared/services/dictionary.service";
import { Dictionary } from "~/app/shared/models/dictionary.model";
import { UserService } from "~/app/shared/services/user.service";

@Component({
  selector: "DailyWord",
  moduleId: module.id,
  templateUrl: "./dailyword.component.html",
  styleUrls: ["./dailyword.component.scss"]
})
export class DailyWordComponent implements OnInit, OnDestroy {
  private _isLoading: boolean = false;
  private _word: Dictionary;

  constructor(
    private _dailyWordService: DailyWordService,
    private _dictionaryService: DictionaryService,
    private _userService: UserService
  ) { }

  ngOnInit(): void {
    this._isLoading = true;
    this._userService.getUserUid().then((userUid: string) => {
      this._dailyWordService.subscribeTodaysWord(userUid)
        .then((dailyWord: DailyWord) => this._dictionaryService.getWordDetails(dailyWord.todaysWord)
          .then((word: Dictionary) => {
            this._word = word;
            this._isLoading = false;
          }).catch((e: any) => {
            this._isLoading = false;
          }))
        .catch((e: any) => {
          this._isLoading = false;
        });
    })
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this._dailyWordService.unsubscribe();
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get word(): Dictionary {
    return this._word;
  }

  getFocusWordSize(wordLength: number) {
    switch (true) {
      case (wordLength <= 5):
        return 40;
      case (wordLength > 5 && wordLength <= 15):
        return 30;
      case (wordLength > 15 && wordLength <= 30):
        return 20;
      default:
        return 10;
    }
  }
}
