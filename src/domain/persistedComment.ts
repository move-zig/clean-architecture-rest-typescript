import { Comment, IComment } from './comment';

export interface IPersistedComment extends IComment {
  readonly id: number;
  children?: IPersistedComment[];
}

export class PersistedComment extends Comment implements IComment {
  #id: number;
  #children?: PersistedComment[];

  public constructor(comment: IPersistedComment) {
    super(comment);
    this.#id = comment.id;
    this.#children = comment.children?.map(c => new PersistedComment(c));
  }

  public get id(): number { return this.#id; }
  public get children(): PersistedComment[] | undefined { return this.#children; }

  public equals(otherComment: IPersistedComment): boolean {
    return this.#id === otherComment.id;
  }
}
