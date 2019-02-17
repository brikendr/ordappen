export class User {
  googleUserUid: string;
  focusWords: Array<string>;
  learnedWords: Array<string>;
  writePriviledges: boolean;

  constructor(options: any) {
    this.googleUserUid = options.uid || options.google_user_uid;
    this.focusWords = options.focus_words || [];
    this.learnedWords = options.learned_words || [];
    this.writePriviledges = options.write_priviledges || false;
  }

  toDocEntries(): any {
    return {
      google_user_uid: this.googleUserUid,
      focus_words: this.focusWords,
      learned_words: this.learnedWords,
      write_priviledges: this.writePriviledges
    };
  }
}
