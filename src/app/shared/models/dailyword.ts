export class DailyWord {
  id: string;
  todaysWord: string;
  thisWeek: Array<string>;

  constructor(options: any) {
    if (options.id) {
      this.id = options.id;
    }
    this.todaysWord = options.todays_word;
    this.thisWeek = options.this_week;
  }
}
