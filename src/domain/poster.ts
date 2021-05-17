export interface IPoster {
  readonly id: number;
  readonly name: string;
  readonly disabled: boolean;
}

export class Poster implements IPoster {
  #id: number;
  #name: string;
  #disabled: boolean;

  public constructor(poster: IPoster) {
    this.#id = poster.id;
    this.#name = poster.name;
    this.#disabled = poster.disabled;
  }

  public get id(): number { return this.#id; }
  public get name(): string { return this.#name; }
  public get disabled(): boolean { return this.#disabled; }

  public canPost(): boolean { return this.#disabled === false; }
}
