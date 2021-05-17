import { ICommentRepository } from '../adapters/gateways/commentRepository';
import { Result, ResultType } from './result';
import { IInteractor } from '.';

export type GetCommentResponseDTO = {
  id: number;
  posterId: number;
  parentId?: number;
  text: string;
};

export class GetCommentNotFound extends Error {}

export class GetCommentInteractor implements IInteractor<number, GetCommentResponseDTO> {
  public constructor(private readonly commentRepository: ICommentRepository) { /* empty */ }

  public async execute(commentId: number): Promise<ResultType<GetCommentResponseDTO>> {
    try {
      const comment = await this.commentRepository.load(commentId);
      if (typeof comment === 'undefined') {
        return Result.fail(new GetCommentNotFound());
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
