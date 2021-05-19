import * as yup from 'yup';

import { getAllCommentsByPosterInteractor } from '../../interactors';
import { GetAllCommentsByPosterNotFound, GetAllCommentsByPosterRequestDTO } from '../../interactors/getAllCommentsByPoster';
import { BaseController } from './baseController';

export class GetAllCommentsByPosterController extends BaseController<GetAllCommentsByPosterRequestDTO> {

  protected async validate(): Promise<GetAllCommentsByPosterRequestDTO | false> {
    try {
      const schema: yup.SchemaOf<GetAllCommentsByPosterRequestDTO> = yup.object({
        posterId: yup.number().positive().defined(),
      });
      return await schema.validate(this.req.query);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.badRequest(error.message);
      } else {
        this.badRequest('invalid request body');
      }
      return false;
    }
  }

  protected async executeImpl(requestDTO: GetAllCommentsByPosterRequestDTO): Promise<void> {
    const interactor = await getAllCommentsByPosterInteractor;
    const result = await interactor.execute(requestDTO);

    if (result.success) {
      this.ok(result.value);
    } else {
      switch (result.error.constructor) {
        case GetAllCommentsByPosterNotFound:
          return this.notFound('Poster not found');
        default:
          return this.internalServerError(result.error.message);
      }
    }
  }
}
