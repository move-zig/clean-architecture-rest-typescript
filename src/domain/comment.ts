export interface IComment {
  readonly posterId: number;
  readonly text: string;
  readonly parentId?: number;
}

export class Comment implements IComment {
  #posterId: number;
  #parentId?: number;
  #text: string;

  public constructor(comment: IComment) {
    this.#posterId = comment.posterId;
    this.#parentId = comment.parentId;
    this.#text = comment.text;
  }

  public get posterId(): number { return this.#posterId; }
  public get text(): string { return this.#text; }
  public get parentId(): number | undefined { return this.#parentId; }
}
