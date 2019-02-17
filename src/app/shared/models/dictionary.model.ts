export class Dictionary {
  id?: string;
  description: string;
  explanationEng: string;
  level: string;
  type: string;
  examples: Array<any>;
  userId: string;

  constructor(options: any) {
    if (options.id) {
      this.id = options.id;
    }

    this.description = options.description;
    this.explanationEng = options.explanation_eng;
    this.level = options.level;
    this.type = options.type;
    this.examples = options.examples;
    this.userId = options.user_id;
  }

  toDocEntries(): any {
    return {
      description: this.description,
      explanation_eng: this.explanationEng,
      level: this.level,
      type: this.type,
      examples: this.examples,
      user_id: this.userId
    };
  }
}
