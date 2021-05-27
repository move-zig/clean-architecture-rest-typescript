import { ILogger } from '../adapters/loggers';
import { CommentRepositoryAddParentNotFound, CommentRepositoryAddPosterNotFound, CommentRepositoryAddPostNotFound, ICommentRepository } from '../adapters/repositories/commentRepository';
import { IPosterRepository } from '../adapters/repositories/posterRepository';
import { Comment } from '../domain/comment';
import { Result, ResultType } from './result';
import { IInteractor } from '.';

export type PostCommentRequestDTO = {
  postId: number;
  posterId: number;
  text: string;
  parentId?: number;
};

export type PostCommentResponseDTO = {
  id: number;
  postId: number;
  posterId: number;
  text: string;
  parentId?: number;
};

export class PostCommentInvalidData extends Error { }

export class PostCommentNotAllowedtoPost extends Error { }

export class PostCommentInteractor implements IInteractor<PostCommentRequestDTO, PostCommentResponseDTO> {

  public constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly posterRepository: IPosterRepository,
    private readonly logger: ILogger,
  ) { /* empty */ }

  public async execute({ postId, posterId, text, parentId }: PostCommentRequestDTO): Promise<ResultType<PostCommentResponseDTO>> {
    try {
      const poster = await this.posterRepository.load(posterId);
      if (typeof poster === 'undefined') {
        return Result.fail(new PostCommentInvalidData('Post not found'));
      }
      if (!poster.canPost()) {
        return Result.fail(new PostCommentNotAllowedtoPost());
      }
      const newComment = new Comment({ postId, posterId, text, parentId });
      const savedComment = await this.commentRepository.add(newComment);
      return Result.success({
        id: savedComment.id,
        postId: savedComment.postId,
        posterId: savedComment.posterId,
        text: savedComment.text,
        parentId: savedComment.parentId,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        switch (err.constructor) {
          case CommentRepositoryAddPostNotFound:
            return Result.fail(new PostCommentInvalidData('Post not found'));
          case CommentRepositoryAddPosterNotFound:
            return Result.fail(new PostCommentInvalidData('Poster not found'));
          case CommentRepositoryAddParentNotFound:
            return Result.fail(new PostCommentInvalidData('Parent not found'));
        }
      }
      this.logger.error('error adding comment', err);
      return Result.fail(err instanceof Error ? err : Error('unknown error'));
    }
  }
}
