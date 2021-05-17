import * as yup from 'yup';

import { interactors } from '../../interactors';
import { PostCommentNotAllowedtoPost, PostCommentNotFound, PostCommentRequestDTO } from '../../interactors/postCommentInteractor';
import { BaseController } from './baseController';

export class AddCommentController extends BaseController {

  protected async executeImpl(): Promise<void> {
    const schema = yup.object({
      posterId: yup.number().required(),
      text: yup.string().required(),
      parentId: yup.number(),
    });
    const body = await schema.validate(this.req.body);

    const requestDTO: PostCommentRequestDTO = {
      posterId: body.posterId,
      text: body.text,
      parentId: body.parentId,
    };

    const { postCommentInteractor } = await interactors;
    const result = await postCommentInteractor.execute(requestDTO);

    if (result.success) {
      this.ok(result.value);
    } else {
      switch (result.error.constructor) {
        case PostCommentNotAllowedtoPost:
          return this.badRequest('Poster is not allowed to post comments');
        case PostCommentNotFound:
          return this.notFound('invalid poster');
        default:
          return this.internalServerError(result.error.message);
      }
    }
  }
}
