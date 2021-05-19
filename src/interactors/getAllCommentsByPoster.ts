import { ILogger } from '../adapters/loggers';
import { ICommentRepository } from '../adapters/repositories/commentRepository';
import { Result, ResultType } from './result';
import { IInteractor } from '.';

export type GetAllCommentsByPosterResponseDTO = Array<{
  id: number;
  posterId: number;
  parentId?: number;
  text: string;
}>;

export class GetAllCommentsByPosterNotFound extends Error {}
export class GetAllCommentsByPosterInvalidId extends Error {}

export class GetAllCommentsByPosterInteractor implements IInteractor<number, GetAllCommentsByPosterResponseDTO> {

  public constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly logger: ILogger,
  ) { /* empty */ }

  public async execute(posterId?: number): Promise<ResultType<GetAllCommentsByPosterResponseDTO>> {
    try {
      if (!posterId) {
        throw new GetAllCommentsByPosterInvalidId();
      }

      const comments = await this.commentRepository.loadAllByPoster(posterId);
      if (typeof comments === 'undefined') {
        return Result.fail(new GetAllCommentsByPosterNotFound());
      }

      const value: GetAllCommentsByPosterResponseDTO = comments.map(c => ({
        id: c.id,
        postId: c.postId,
        posterId: c.posterId,
        parentId: c.parentId,
        text: c.text,
      }));
      return Result.success(value);
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error('error getting all comments by poster', err);
        return Result.fail(err);
      }
      this.logger.error('error getting all comments by poster', err);
      return Result.fail(Error('unknown error'));
    }
  }
}
