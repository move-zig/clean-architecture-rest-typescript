import { IRepository } from '../adapters/gateways/repository';
import { Result, ResultType } from './result';
import { IInteractor } from '.';

export type GetAllCommentsByPosterResponseDTO = Array<{
  id: number;
  posterId: number;
  parentId?: number;
  text: string;
}>;

export class GetAllCommentsByPosterInteractorNotFoundError extends Error {}
export class GetAllCommentsByPosterInteractorInvalidArgument extends Error {}

export class GetAllCommentsByPosterInteractor implements IInteractor<number, GetAllCommentsByPosterResponseDTO> {
  public constructor(private readonly repository: IRepository) { /* empty */ }

  public async execute(posterId?: number): Promise<ResultType<GetAllCommentsByPosterResponseDTO>> {
    try {
      if (!posterId) {
        throw new GetAllCommentsByPosterInteractorInvalidArgument();
      }
      const comments = await this.repository.loadCommentsByPoster(posterId);
      if (typeof comments === 'undefined') {
        return Result.fail(new GetAllCommentsByPosterInteractorNotFoundError());
      }
      return Result.success(comments.map(c => ({
        id: c.id,
        posterId: c.posterId,
        parentId: c.parentId,
        text: c.text,
      })));
    } catch (err: unknown) {
      if (err instanceof Error) {
        return Result.fail(err);
      }
      return Result.fail(Error('unknown error'));
    }
  }
}
