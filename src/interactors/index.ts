import { repository } from '../adapters/gateways';
import { GetAllCommentsByPosterInteractor } from './getAllCommentsByPoster';
import { GetCommentInteractor } from './getCommentInteractor';
import { PostCommentInteractor } from './postCommentInteractor';
import { ResultType } from './result';

export interface IInteractor<RequestDTO, ResponseDTO> {
  execute: (arg: RequestDTO) => ResultType<ResponseDTO> | Promise<ResultType<ResponseDTO>>;
}

export const interactors = repository.then(r => ({
  postCommentInteractor: new PostCommentInteractor(r),
  getCommentInteractor: new GetCommentInteractor(r),
  getAllCommentsByPosterInteractor: new GetAllCommentsByPosterInteractor(r),
}));
