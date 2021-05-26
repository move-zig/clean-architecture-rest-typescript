import { winstonLogger } from '../adapters/loggers';
import { commentRepository, posterRepository } from '../adapters/repositories';
import { GetAllCommentsByPosterInteractor } from './getAllCommentsByPoster';
import { GetCommentInteractor } from './getCommentInteractor';
import { PostCommentInteractor } from './postCommentInteractor';
import { ResultType } from './result';

export interface IInteractor<RequestDTO, ResponseDTO> {
  execute: (arg: RequestDTO) => ResultType<ResponseDTO> | Promise<ResultType<ResponseDTO>>;
}

export const postCommentInteractor = new PostCommentInteractor(commentRepository, posterRepository, winstonLogger);
export const getCommentInteractor = new GetCommentInteractor(commentRepository, winstonLogger);
export const getAllCommentsByPosterInteractor = new GetAllCommentsByPosterInteractor(commentRepository, winstonLogger);
