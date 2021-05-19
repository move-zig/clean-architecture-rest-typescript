import { getCommentInteractor } from '../../interactors';
import { GetCommentNotFound } from '../../interactors/getCommentInteractor';
import { BaseController } from './baseController';

export class GetCommentController extends BaseController {

  protected async executeImpl(): Promise<void> {
    const commentId = parseInt(this.req.params.commentId, 10);

    const result = await (await getCommentInteractor).execute(commentId);

    if (result.success) {
      this.ok(result.value);
    } else {
      switch (result.error.constructor) {
        case GetCommentNotFound:
          return this.notFound('Comment not found');
        default:
          return this.internalServerError(result.error.message);
      }
    }
  }
}
