import { ICommentRepository } from '../adapters/gateways/commentRepository';
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
  public constructor(private readonly commentRepository: ICommentRepository) { /* empty */ }

  public async execute(posterId?: number): Promise<ResultType<GetAllCommentsByPosterResponseDTO>> {
    try {
      if (!posterId) {
        throw new GetAllCommentsByPosterInvalidId();
      }
      const comments = await this.commentRepository.loadAllByPoster(posterId);
      if (typeof comments === 'undefined') {
        return Result.fail(new GetAllCommentsByPosterNotFound());
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
