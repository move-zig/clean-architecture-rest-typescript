import { IRepository } from '../adapters/gateways/repository';
import { Result, ResultType } from './result';
import { IInteractor } from '.';

export type GetCommentResponseDTO = {
  id: number;
  posterId: number;
  parentId?: number;
  text: string;
};

export class GetCommentInteractorNotFoundError extends Error {}

export class GetCommentInteractor implements IInteractor<number, GetCommentResponseDTO> {
  public constructor(private readonly repository: IRepository) { /* empty */ }

  public async execute(commentId: number): Promise<ResultType<GetCommentResponseDTO>> {
    try {
      const comment = await this.repository.loadComment(commentId);
      if (typeof comment === 'undefined') {
        return Result.fail(new GetCommentInteractorNotFoundError());
      }
      return Result.success({
        id: comment.id,
        posterId: comment.posterId,
        parentId: comment.parentId,
        text: comment.text,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return Result.fail(err);
      }
      return Result.fail(Error('unknown error'));
    }
  }
}
