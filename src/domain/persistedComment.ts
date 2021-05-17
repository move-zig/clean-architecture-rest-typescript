import { Comment, IComment } from './comment';

export interface IPersistedComment extends IComment {
  readonly id: number;
}

export class PersistedComment extends Comment implements IComment {
  #id: number;

  public constructor(comment: IPersistedComment) {
    super(comment);
    this.#id = comment.id;
  }

  public get id(): number { return this.#id; }
}
