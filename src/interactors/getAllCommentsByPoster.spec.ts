import faker from 'faker';
import { PersistedComment } from '../domain/persistedComment';

import { GetAllCommentsByPosterInteractor, GetAllCommentsByPosterInvalidId, GetAllCommentsByPosterNotFound, GetAllCommentsByPosterResponseDTO } from './getAllCommentsByPoster';
import { IErrorResult, ISuccessResult } from './result';

describe('GetAllCommentsByPosterInteractor', () => {

  let commentRepository: { load: jest.Mock; loadWithChildren: jest.Mock; add: jest.Mock; loadAllByPoster: jest.Mock };
  let logger: { error: jest.Mock; warn: jest.Mock; info: jest.Mock };
  let interactor: GetAllCommentsByPosterInteractor;

  beforeEach(() => {
    commentRepository = { load: jest.fn(), loadWithChildren: jest.fn(), add: jest.fn(), loadAllByPoster: jest.fn() };
    logger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };
    interactor = new GetAllCommentsByPosterInteractor(commentRepository, logger);
  });

  describe('execute method', () => {
    let argument: number | undefined;

    describe('when passed undefined', () => {

      beforeEach(() => {
        argument = undefined;
      });

      it('should return a failure result', async () => {
        const result = await interactor.execute(argument) as IErrorResult;
        expect(result.success).toBe(false);
        expect(result.error).toBeInstanceOf(GetAllCommentsByPosterInvalidId);
      });
    });

    describe('when passed a number', () => {

      beforeEach(() => {
        argument = faker.datatype.number();
      });

      describe('when commentRepository.loadAllByPoster rejects', () => {
        let error: Error;

        beforeEach(() => {
          error = Error(faker.random.words(10));
          commentRepository.loadAllByPoster.mockRejectedValue(error);
        });

        it('should log the error and return a failure result', async () => {
          const result = await interactor.execute(argument) as IErrorResult;
          expect(logger.error).toHaveBeenCalledTimes(1);
          expect(logger.error).toHaveBeenCalledWith('error getting all comments by poster', error);
          expect(result.success).toBe(false);
          expect(result.error).toBe(error);
        });
      });

      describe('when commentRepository.loadAllByPoster resolves undefined', () => {

        beforeEach(() => {
          commentRepository.loadAllByPoster.mockResolvedValue(undefined);
        });

        it('should return a failure result', async () => {
          const result = await interactor.execute(argument) as IErrorResult;
          expect(result.success).toBe(false);
          expect(result.error).toBeInstanceOf(GetAllCommentsByPosterNotFound);
        });
      });

      describe('when commentRepository.loadAllByPoster resolves some comments', () => {
        let id: number;
        let postId: number;
        let posterId: number;
        let text: string;
        let comments: PersistedComment[];

        beforeEach(() => {
          id = faker.datatype.number();
          postId = faker.datatype.number();
          posterId = faker.datatype.number();
          text = faker.random.words(32);
          comments = [
            new PersistedComment({ id, postId, posterId, text, parentId: 32 }),
            new PersistedComment({ id: id + 1, postId: postId + 23, posterId, text: text + '!!!' }),
          ];
          commentRepository.loadAllByPoster.mockResolvedValue(comments);
        });

        it('should return a success result', async () => {
          const result = await interactor.execute(argument) as ISuccessResult<GetAllCommentsByPosterResponseDTO>;
          expect(result.success).toBe(true);
          expect(result.value).toEqual([
            { id, postId, posterId, text, parentId: 32 },
            { id: id + 1, postId: postId + 23, posterId, text: text + '!!!', parentId: undefined },
          ]);
        });
      });
    });
  });
});
