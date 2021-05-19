import { ILogger } from '../adapters/loggers';
import { ICommentRepository } from '../adapters/repositories/commentRepository';
import { Result, ResultType } from './result';
import { IInteractor } from '.';

export type GetCommentRequestDTO = {
  commentId: number;
};

export type GetCommentResponseDTO = {
  id: number;
  posterId: number;
  parentId?: number;
  text: string;
  children?: GetCommentResponseDTO[];
};

export class GetCommentNotFound extends Error { }

export class GetCommentInteractor implements IInteractor<GetCommentRequestDTO, GetCommentResponseDTO> {

  public constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly logger: ILogger,
  ) { /* empty */ }

  public async execute({ commentId }: GetCommentRequestDTO): Promise<ResultType<GetCommentResponseDTO>> {
    try {
      const comment = await this.commentRepository.loadWithChildren(commentId);
      if (typeof comment === 'undefined') {
        return Result.fail(new GetCommentNotFound());
      }
      return Result.success({
        id: comment.id,
        posterId: comment.posterId,
        parentId: comment.parentId,
        text: comment.text,
        children: comment.children?.map(c => ({
          id: c.id,
          posterId: c.posterId,
          parentId: c.parentId,
          text: c.text,
        })),
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error('error getting comment', err);
        return Result.fail(err);
      }
      this.logger.error('error getting comment', err);
      return Result.fail(Error('unknown error'));
    }
  }
}
