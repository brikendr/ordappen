export class Type {
  id?: string;
  name: string;

  constructor(options: any) {
    if (options.id) {
      this.id = options.id;
    }

    this.name = options.name;
  }
}
