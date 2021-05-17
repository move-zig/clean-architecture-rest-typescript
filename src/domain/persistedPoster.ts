import { IPoster, Poster } from './poster';

export interface IPersistedPoster extends IPoster {
  readonly id: number;
}

export class PersistedPoster extends Poster implements IPersistedPoster {
  #id: number;

  public constructor(poster: IPersistedPoster) {
    super(poster);
    this.#id = poster.id;
  }

  public get id(): number { return this.#id; }
}
