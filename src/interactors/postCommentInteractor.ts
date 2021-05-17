import { ICommentRepository } from '../adapters/gateways/commentRepository';
import { IPosterRepository } from '../adapters/gateways/posterRepository';
import { Comment } from '../domain/comment';
import { Result, ResultType } from './result';
import { IInteractor } from '.';

export type PostCommentRequestDTO = {
  posterId: number;
  text: string;
  parentId?: number;
};

export class PostCommentNotFound extends Error { }

export class PostCommentNotAllowedtoPost extends Error { }

export class PostCommentInteractor implements IInteractor<PostCommentRequestDTO, Comment> {

  public constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly posterRepository: IPosterRepository,
  ) { /* empty */ }

  public async execute({ posterId, text, parentId }: PostCommentRequestDTO): Promise<ResultType<Comment>> {
    try {
      const poster = await this.posterRepository.load(posterId);
      if (typeof poster === 'undefined') {
        return Result.fail(new PostCommentNotFound());
      }
      if (!poster.canPost()) {
        return Result.fail(new PostCommentNotAllowedtoPost());
      }
      const newComment = new Comment({ posterId, text, parentId });
      const savedComment = await this.commentRepository.add(newComment);
      return Result.success(savedComment);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return Result.fail(err);
      }
      return Result.fail(Error('unknown error'));
    }
  }
}
