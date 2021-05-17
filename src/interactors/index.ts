import { repository } from '../adapters/gateways';
import { GetAllCommentsByPosterInteractor } from './getAllCommentsByPoster';
import { GetCommentInteractor } from './getCommentInteractor';
import { PostCommentInteractor } from './postCommentInteractor';
import { ResultType } from './result';

export interface IInteractor<RequestDTO, ResponseDTO> {
  execute: (arg: RequestDTO) => ResultType<ResponseDTO> | Promise<ResultType<ResponseDTO>>;
}

export const interactors = repository.then(({ posterRepository, commentRepository }) => ({
  postCommentInteractor: new PostCommentInteractor(commentRepository, posterRepository),
  getCommentInteractor: new GetCommentInteractor(commentRepository),
  getAllCommentsByPosterInteractor: new GetAllCommentsByPosterInteractor(commentRepository),
}));
