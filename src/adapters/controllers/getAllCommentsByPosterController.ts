import { interactors } from '../../interactors';
import { GetAllCommentsByPosterInteractorInvalidArgument, GetAllCommentsByPosterInteractorNotFoundError } from '../../interactors/getAllCommentsByPoster';
import { BaseController } from './baseController';

export class GetAllCommentsByPosterController extends BaseController {

  protected async executeImpl(): Promise<void> {
    let posterId: number | undefined;
    if (typeof this.req.query.posterId === 'string') {
      posterId = parseInt(this.req.query.posterId, 10);
    }

    const { getAllCommentsByPosterInteractor } = await interactors;
    const result = await getAllCommentsByPosterInteractor.execute(posterId);

    if (result.success) {
      this.ok(result.value);
    } else {
      switch (result.error.constructor) {
        case GetAllCommentsByPosterInteractorInvalidArgument:
          return this.badRequest('No poster specified');
        case GetAllCommentsByPosterInteractorNotFoundError:
          return this.notFound('Poster not found');
        default:
          return this.internalServerError(result.error.message);
      }
    }
  }
}
