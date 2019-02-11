export class DailyWord {
  id?: string;
  dictionaryId: string;

  constructor(options: any) {
    if (options.id) {
      this.id = options.id;
    }

    this.dictionaryId = options.dictionary_id;
  }
}
