import { getAllCommentsByPosterInteractor } from '../../interactors';
import { GetAllCommentsByPosterInvalidId, GetAllCommentsByPosterNotFound } from '../../interactors/getAllCommentsByPoster';
import { BaseController } from './baseController';

export class GetAllCommentsByPosterController extends BaseController {

  protected async executeImpl(): Promise<void> {
    let posterId: number | undefined;
    if (typeof this.req.query.posterId === 'string') {
      posterId = parseInt(this.req.query.posterId, 10);
    }

    const result = await (await getAllCommentsByPosterInteractor).execute(posterId);

    if (result.success) {
      this.ok(result.value);
    } else {
      switch (result.error.constructor) {
        case GetAllCommentsByPosterInvalidId:
          return this.badRequest('No poster specified');
        case GetAllCommentsByPosterNotFound:
          return this.notFound('Poster not found');
        default:
          return this.internalServerError(result.error.message);
      }
    }
  }
}
