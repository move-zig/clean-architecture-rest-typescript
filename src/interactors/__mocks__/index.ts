import { Result } from '../result';

const mockPostCommentInteractor = jest.fn().mockImplementation(() => ({
  execute: jest.fn().mockResolvedValue(Result.success(undefined)),
}));

const mockGetCommentInteractor = jest.fn().mockImplementation(() => ({
  execute: jest.fn().mockResolvedValue(Result.success(undefined)),
}));

const mockGetAllCommentsByPosterInteractor = jest.fn().mockImplementation(() => ({
  execute: jest.fn().mockResolvedValue(Result.success(undefined)),
}));

export const postCommentInteractor = Promise.resolve(mockPostCommentInteractor());
export const getCommentInteractor = Promise.resolve(mockGetCommentInteractor());
export const getAllCommentsByPosterInteractor = Promise.resolve(mockGetAllCommentsByPosterInteractor());
