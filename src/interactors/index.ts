import { winstonLogger } from '../adapters/loggers';
import { repositories } from '../adapters/repositories';
import { GetAllCommentsByPosterInteractor } from './getAllCommentsByPoster';
import { GetCommentInteractor } from './getCommentInteractor';
import { PostCommentInteractor } from './postCommentInteractor';
import { ResultType } from './result';

export interface IInteractor<RequestDTO, ResponseDTO> {
  execute: (arg: RequestDTO) => ResultType<ResponseDTO> | Promise<ResultType<ResponseDTO>>;
}

export const postCommentInteractor = repositories.then(r => new PostCommentInteractor(r.commentRepository, r.posterRepository, winstonLogger));
export const getCommentInteractor = repositories.then(r => new GetCommentInteractor(r.commentRepository, winstonLogger));
export const getAllCommentsByPosterInteractor = repositories.then(r => new GetAllCommentsByPosterInteractor(r.commentRepository, winstonLogger));
