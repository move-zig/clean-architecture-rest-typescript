import * as yup from 'yup';

import { getCommentInteractor } from '../../interactors';
import { GetCommentNotFound, GetCommentRequestDTO } from '../../interactors/getCommentInteractor';
import { BaseController } from './baseController';

export class GetCommentController extends BaseController<GetCommentRequestDTO> {

  protected async validate(): Promise<GetCommentRequestDTO | false> {
    try {
      const schema: yup.SchemaOf<GetCommentRequestDTO> = yup.object({
        commentId: yup.number().positive().defined(),
      });
      return await schema.validate(this.req.params);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.badRequest(error.message);
      } else {
        this.badRequest('invalid request body');
      }
      return false;
    }
  }

  protected async executeImpl(requestDTO: GetCommentRequestDTO): Promise<void> {
    const result = await getCommentInteractor.execute(requestDTO);

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
