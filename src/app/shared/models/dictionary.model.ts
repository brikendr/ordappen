export class Dictionary {
  id?: string;
  description: string;
  explanationEng: string;
  level: string;
  type: string;
  usageExamples: Array<string>
  userId: string

  constructor(options: any) {
    if (options.id) {
      this.id = options.id;
    }

    this.description = options.description;
    this.explanationEng = options.explanation_eng;
    this.level = options.level;
    this.type = options.type;
    this.usageExamples = options.usage_examples;
    this.userId = options.user_id
  }
}

