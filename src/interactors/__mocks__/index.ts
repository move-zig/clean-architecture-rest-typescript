import { Result } from '../result';

export const postCommentInteractor = {
  execute: jest.fn().mockResolvedValue(Result.success(undefined)),
};

export const getCommentInteractor = {
  execute: jest.fn().mockResolvedValue(Result.success(undefined)),
};

export const getAllCommentsByPosterInteractor = {
  execute: jest.fn().mockResolvedValue(Result.success(undefined)),
};
