import faker from 'faker';

import { postCommentInteractor } from '../../interactors';
import { PostCommentInvalidData, PostCommentNotAllowedtoPost } from '../../interactors/postCommentInteractor';
import { Result } from '../../interactors/result';
import { AddCommentController } from './addCommentController';
import { BaseController } from './baseController';

import type { Request, Response } from 'express';

jest.mock('../../interactors');

describe('AddCommentController', () => {

  let controller: AddCommentController;

  let okSpy: jest.SpyInstance;
  let badRequestSpy: jest.SpyInstance;
  let internalServerErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    okSpy = jest.spyOn(BaseController.prototype as any, 'ok');
    badRequestSpy = jest.spyOn(BaseController.prototype as any, 'badRequest');
    internalServerErrorSpy = jest.spyOn(BaseController.prototype as any, 'internalServerError');
  });

  it('should extend BaseController', () => {
    const req = {} as Request;
    const res = {} as Response;
    controller = new AddCommentController(req, res);
    expect(controller).toBeInstanceOf(BaseController);
  });

  describe('execute method', () => {
    let req: Request;
    let res: Response;

    beforeEach(() => {
      req = {
        body: {},
      } as Request;

      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;
    });

    describe('when passed bad input', () => {

      beforeEach(() => {
        req = {
          body: { invalidData: 'pineapple' },
        } as Request;
        controller = new AddCommentController(req, res);
      });

      it('should call badRequest', async () => {
        await controller.execute();
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
        } as Request;
        controller = new AddCommentController(req, res);
      });

      it('should call the interactor with the correct parameters', async () => {
        await controller.execute();
        expect(postCommentInteractor.execute).toHaveBeenCalledTimes(1);
        expect(postCommentInteractor.execute).toHaveBeenCalledWith({ postId, posterId, text, parentId });
      });

      describe('when the interactor returns a successful value', () => {
        let value: number;

        beforeEach(() => {
          value = faker.datatype.number();
          (postCommentInteractor.execute as jest.Mock).mockResolvedValue(Result.success(value));
        });

        it('should call ok', async () => {
          await controller.execute();
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
          (postCommentInteractor.execute as jest.Mock).mockResolvedValue(Result.fail(error));
        });

        it('should call badRequest', async () => {
          await controller.execute();
          expect(badRequestSpy).toHaveBeenCalledTimes(1);
          expect(badRequestSpy).toHaveBeenCalledWith(message);
        });
      });

      describe('when the interactor returns a PostCommentNotAllowedtoPost error', () => {
        let error: Error;

        beforeEach(() => {
          error = new PostCommentNotAllowedtoPost();
          (postCommentInteractor.execute as jest.Mock).mockResolvedValue(Result.fail(error));
        });

        it('should call badRequest', async () => {
          await controller.execute();
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
          (postCommentInteractor.execute as jest.Mock).mockResolvedValue(Result.fail(error));
        });

        it('should call badRequest', async () => {
          await controller.execute();
          expect(internalServerErrorSpy).toHaveBeenCalledTimes(1);
          expect(internalServerErrorSpy).toHaveBeenCalledWith(message);
        });
      });
    });
  });
});
