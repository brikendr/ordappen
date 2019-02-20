export class DailyWord {
  id: string;
  todaysWord: string;
  thisWeek: Array<string>;
  addedOn: number;
  shouldUpdate: boolean;

  constructor(options: any) {
    if (options.id) {
      this.id = options.id;
    }
    this.todaysWord = options.todays_word;
    this.thisWeek = options.this_week;
    this.addedOn = options.added_on;
    this.shouldUpdate = options.should_update;
  }
}
