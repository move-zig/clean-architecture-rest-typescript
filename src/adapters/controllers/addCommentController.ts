import * as yup from 'yup';

import { postCommentInteractor } from '../../interactors';
import { PostCommentInvalidData, PostCommentNotAllowedtoPost, PostCommentRequestDTO } from '../../interactors/postCommentInteractor';
import { BaseController } from './baseController';

export class AddCommentController extends BaseController<PostCommentRequestDTO> {

  protected async validate(): Promise<PostCommentRequestDTO | false> {
    try {
      const schema: yup.SchemaOf<PostCommentRequestDTO> = yup.object({
        postId: yup.number().positive().defined(),
        posterId: yup.number().positive().defined(),
        text: yup.string().defined(),
        parentId: yup.number(),
      });
      return await schema.validate(this.req.body);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.badRequest(error.message);
      } else {
        this.badRequest('invalid request body');
      }
      return false;
    }
  }

  protected async executeImpl(requestDTO: PostCommentRequestDTO): Promise<void> {
    const interactor = await postCommentInteractor;
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
}
