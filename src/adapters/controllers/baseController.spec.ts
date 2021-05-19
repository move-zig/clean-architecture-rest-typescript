import { Request, Response } from 'express';
import faker from 'faker';

import { BaseController } from './baseController';

/**
 * BaseController is an abstract class. In order to test its methods
 * we need to create a new class that extends BaseClass.
 *
 * Because most of the methods we want to test are protected, we will
 * call them indirectly through the new class's executeImpl method.
 * executeImpl is also protected and is called indirectly via
 * BaseController's public execute method.
 */

describe('BaseController', () => {
  let controller: any;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    controller = Object.create(BaseController.prototype);
    req = { } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      end: jest.fn(),
    } as unknown as Response;
  });

  describe('execute method', () => {

    it('should call the executeImpl method', () => {
      controller.executeImpl = async function () {
        return Promise.resolve(undefined);
      };
      jest.spyOn(controller, 'executeImpl');

      controller.execute(req, res);
      expect(controller.executeImpl).toHaveBeenCalledTimes(1);
    });
  });

  describe('ok method', () => {
    it('should send the correct response', () => {
      const data = {
        id: faker.datatype.number(),
        message: faker.random.words(10),
      };

      controller.executeImpl = async function () {
        return Promise.resolve(this.ok(data));
      };
      jest.spyOn(controller, 'executeImpl');

      controller.execute(req, res);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(data);
    });
  });

  describe('created method', () => {
    it('should send the correct response', () => {
      const data = {
        id: faker.datatype.number(),
        message: faker.random.words(10),
      };

      controller.executeImpl = async function () {
        return Promise.resolve(this.created(data));
      };
      jest.spyOn(controller, 'executeImpl');

      controller.execute(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(data);
    });
  });

  describe('noContent method', () => {
    it('should send the correct response', () => {
      const data = {
        id: faker.datatype.number(),
        message: faker.random.words(10),
      };

      controller.executeImpl = async function () {
        return Promise.resolve(this.noContent(data));
      };
      jest.spyOn(controller, 'executeImpl');

      controller.execute(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalledTimes(1);
      expect(res.end).toHaveBeenCalledWith();
    });
  });

  describe('badRequest method', () => {
    it('should send the correct response when a message is passed', () => {
      const message = faker.random.words();

      controller.executeImpl = async function () {
        return Promise.resolve(this.badRequest(message));
      };
      jest.spyOn(controller, 'executeImpl');

      controller.execute(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(message);
    });

    it('should send the correct response when no message is passed', () => {
      controller.executeImpl = async function () {
        return Promise.resolve(this.badRequest());
      };
      jest.spyOn(controller, 'executeImpl');

      controller.execute(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith('Bad Request');
    });
  });

  describe('unauthorized method', () => {
    it('should send the correct response when a message is passed', () => {
      const message = faker.random.words();

      controller.executeImpl = async function () {
        return Promise.resolve(this.unauthorized(message));
      };
      jest.spyOn(controller, 'executeImpl');

      controller.execute(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(message);
    });

    it('should send the correct response when no message is passed', () => {
      controller.executeImpl = async function () {
        return Promise.resolve(this.unauthorized());
      };
      jest.spyOn(controller, 'executeImpl');

      controller.execute(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith('Unauthorized');
    });
  });
});
