import { AddCommentController } from './addCommentController';
import { GetAllCommentsByPosterController } from './getAllCommentsByPosterController';
import { GetCommentController } from './getCommentController';

export const addCommentController = new AddCommentController();
export const getCommentController = new GetCommentController();
export const getAllCommentsByPosterController = new GetAllCommentsByPosterController();
