import * as yup from 'yup';

import { postCommentInteractor } from '../../interactors';
import { PostCommentInteractor, PostCommentInvalidData, PostCommentNotAllowedtoPost, PostCommentRequestDTO } from '../../interactors/postCommentInteractor';
import { BaseController } from './baseController';

export class AddCommentController extends BaseController {

  protected async executeImpl(): Promise<void> {
    let requestDTO: PostCommentRequestDTO;
    try {
      const schema: yup.SchemaOf<PostCommentRequestDTO> = yup.object({
        postId: yup.number().positive().defined(),
        posterId: yup.number().positive().defined(),
        text: yup.string().defined(),
        parentId: yup.number(),
      });
      requestDTO = await schema.validate(this.req.body);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.badRequest(error.message);
      }
      return this.badRequest('invalid request body');
    }

    const interactor = await this.getInteractor();
    const result = await interactor.execute(requestDTO);

    if (result.success) {
      this.ok(result.value);
    } else {
      switch (result.error.constructor) {
        case PostCommentInvalidData:
          return this.badRequest(result.error.message);
        case PostCommentNotAllowedtoPost:
          return this.badRequest('Poster is not allowed to post comments');
        default:
          return this.internalServerError(result.error.message);
      }
    }
  }

  private async getInteractor(): Promise<PostCommentInteractor> {
    return postCommentInteractor;
  }
}
