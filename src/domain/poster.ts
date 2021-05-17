export interface IPoster {
  readonly name: string;
  readonly disabled: boolean;
}

export class Poster implements IPoster {
  #name: string;
  #disabled: boolean;

  public constructor(poster: IPoster) {
    this.#name = poster.name;
    this.#disabled = poster.disabled;
  }

  public get name(): string { return this.#name; }
  public get disabled(): boolean { return this.#disabled; }

  public canPost(): boolean { return this.#disabled === false; }
}
