import { ILogger } from '../adapters/loggers';
import { ICommentRepository } from '../adapters/repositories/commentRepository';
import { Result, ResultType } from './result';
import { IInteractor } from '.';

export type GetAllCommentsByPosterRequestDTO = {
  posterId: number;
};

export type GetAllCommentsByPosterResponseDTO = Array<{
  id: number;
  posterId: number;
  parentId?: number;
  text: string;
}>;

export class GetAllCommentsByPosterNotFound extends Error {}

export class GetAllCommentsByPosterInteractor implements IInteractor<GetAllCommentsByPosterRequestDTO, GetAllCommentsByPosterResponseDTO> {

  public constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly logger: ILogger,
  ) { /* empty */ }

  public async execute({ posterId }: GetAllCommentsByPosterRequestDTO): Promise<ResultType<GetAllCommentsByPosterResponseDTO>> {
    try {
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
      this.logger.error('error getting all comments by poster', err);
      return Result.fail(err instanceof Error ? err : Error('unknown error'));
    }
  }
}
