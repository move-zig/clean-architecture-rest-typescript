export interface IPoster {
  readonly name: string;
  readonly disabled: boolean;
  readonly signUpDate: Date;
}

export class Poster implements IPoster {

  private static readonly minAgeToPost = 1000 * 60 * 60 * 24;

  #name: string;
  #disabled: boolean;
  #signUpDate: Date;

  public constructor(poster: IPoster) {
    this.#name = poster.name;
    this.#disabled = poster.disabled;
    this.#signUpDate = poster.signUpDate;
  }

  public get name(): string { return this.#name; }
  public get disabled(): boolean { return this.#disabled; }
  public get signUpDate(): Date { return this.#signUpDate; }

  public getAge(): number {
    return new Date().getTime() - this.signUpDate.getTime();
  }

  public canPost(): boolean {
    console.log(this.getAge());
    console.log(this.#disabled);
    return this.getAge() > Poster.minAgeToPost && this.#disabled === false;
  }
}
