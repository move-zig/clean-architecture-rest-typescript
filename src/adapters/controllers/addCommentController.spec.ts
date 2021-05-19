import { Request, Response } from 'express';
import faker from 'faker';

import { postCommentInteractor } from '../../interactors';
import { PostCommentInvalidData, PostCommentNotAllowedtoPost } from '../../interactors/postCommentInteractor';
import { Result } from '../../interactors/result';
import { AddCommentController } from './addCommentController';
import { BaseController } from './baseController';

jest.mock('../../interactors');

describe('AddCommentController', () => {

  let controller: AddCommentController;
  let interactor: { execute: jest.Mock };

  let okSpy: jest.SpyInstance;
  let badRequestSpy: jest.SpyInstance;
  let internalServerErrorSpy: jest.SpyInstance;

  beforeAll(async () => {
    okSpy = jest.spyOn(BaseController.prototype as any, 'ok');
    badRequestSpy = jest.spyOn(BaseController.prototype as any, 'badRequest');
    internalServerErrorSpy = jest.spyOn(BaseController.prototype as any, 'internalServerError');
    interactor = await postCommentInteractor as unknown as { execute: jest.Mock };
  });

  beforeEach(() => {
    controller = new AddCommentController();
  });

  it('should extend BaseController', () => {
    expect(controller).toBeInstanceOf(BaseController);
  });

  describe('execute method', () => {
    let req: Request;
    let res: Response;

    beforeEach(() => {
      req = {
        body: {},
      } as unknown as Request;

      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;
    });

    describe('when passed bad input', () => {

      beforeEach(() => {
        req = {
          body: { invalidData: 'pineapple' },
        } as unknown as Request;
      });

      it('should call badRequest', async () => {
        await controller.execute(req, res);
        expect(badRequestSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when passed well-formed input', () => {
      let postId: number;
      let posterId: number;
      let text: string;
      let parentId: number;

      beforeEach(() => {
        postId = faker.datatype.number();
        posterId = faker.datatype.number();
        text = faker.random.words(42);
        parentId = faker.datatype.number();
        req = {
          body: { postId, posterId, text, parentId },
        } as unknown as Request;
      });

      it('should call the interactor with the correct parameters', async () => {
        await controller.execute(req, res);
        expect(interactor.execute).toHaveBeenCalledTimes(1);
        expect(interactor.execute).toHaveBeenCalledWith({ postId, posterId, text, parentId });
      });

      describe('when the interactor returns a successful value', () => {
        let value: number;

        beforeEach(() => {
          value = faker.datatype.number();
          interactor.execute.mockResolvedValue(Result.success(value));
        });

        it('should call ok', async () => {
          await controller.execute(req, res);
          expect(okSpy).toHaveBeenCalledTimes(1);
          expect(okSpy).toHaveBeenCalledWith(value);
        });
      });

      describe('when the interactor returns a PostCommentInvalidData error', () => {
        let message: string;
        let error: Error;

        beforeEach(() => {
          message = faker.random.words(10);
          error = new PostCommentInvalidData(message);
          interactor.execute.mockResolvedValue(Result.fail(error));
        });

        it('should call badRequest', async () => {
          await controller.execute(req, res);
          expect(badRequestSpy).toHaveBeenCalledTimes(1);
          expect(badRequestSpy).toHaveBeenCalledWith(message);
        });
      });

      describe('when the interactor returns a PostCommentNotAllowedtoPost error', () => {
        let error: Error;

        beforeEach(() => {
          error = new PostCommentNotAllowedtoPost();
          interactor.execute.mockResolvedValue(Result.fail(error));
        });

        it('should call badRequest', async () => {
          await controller.execute(req, res);
          expect(badRequestSpy).toHaveBeenCalledTimes(1);
          expect(badRequestSpy).toHaveBeenCalledWith('Poster is not allowed to post comments');
        });
      });

      describe('when the interactor returns any other type of error', () => {
        let message: string;
        let error: Error;

        beforeEach(() => {
          message = faker.random.words(10);
          error = Error(message);
          interactor.execute.mockResolvedValue(Result.fail(error));
        });

        it('should call badRequest', async () => {
          await controller.execute(req, res);
          expect(internalServerErrorSpy).toHaveBeenCalledTimes(1);
          expect(internalServerErrorSpy).toHaveBeenCalledWith(message);
        });
      });
    });
  });
});
