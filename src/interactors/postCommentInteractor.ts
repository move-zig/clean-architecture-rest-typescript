import { IRepository } from '../adapters/gateways/repository';
import { Comment } from '../domain/comment';
import { Result, ResultType } from './result';
import { IInteractor } from '.';

export type PostCommentRequestDTO = {
  posterId: number;
  text: string;
  parentId?: number;
};

export class PostCommentInteractorNotFoundError extends Error { }

export class PostCommentInteractorNotAllowedtoPostError extends Error { }

export class PostCommentInteractor implements IInteractor<PostCommentRequestDTO, Comment> {

  public constructor(private readonly repository: IRepository) { /* empty */ }

  public async execute({ posterId, text, parentId }: PostCommentRequestDTO): Promise<ResultType<Comment>> {
    try {
      const poster = await this.repository.loadPoster(posterId);
      if (typeof poster === 'undefined') {
        return Result.fail(new PostCommentInteractorNotFoundError());
      }
      if (!poster.canPost()) {
        return Result.fail(new PostCommentInteractorNotAllowedtoPostError());
      }
      const newComment = new Comment({ posterId, text, parentId });
      const savedComment = await this.repository.addComment(newComment);
      return Result.success(savedComment);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return Result.fail(err);
      }
      return Result.fail(Error('unknown error'));
    }
  }
}
