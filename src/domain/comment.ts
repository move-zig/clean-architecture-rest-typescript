export interface IComment {
  readonly postId: number;
  readonly posterId: number;
  readonly text: string;
  readonly parentId?: number;
  children?: IComment[];
}

export class Comment implements IComment {
  #postId: number;
  #posterId: number;
  #parentId?: number;
  #text: string;
  #children?: Comment[];

  public constructor(comment: IComment) {
    this.#postId = comment.postId;
    this.#posterId = comment.posterId;
    this.#parentId = comment.parentId;
    this.#text = comment.text;
    this.#children = comment.children?.map(c => new Comment(c));
  }

  public get postId(): number { return this.#postId; }
  public get posterId(): number { return this.#posterId; }
  public get text(): string { return this.#text; }
  public get parentId(): number | undefined { return this.#parentId; }
  public get children(): Comment[] | undefined { return this.#children; }
}
