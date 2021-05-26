import faker from 'faker';

import { BaseController } from './baseController';

import type { Request, Response } from 'express';

type RequestDTO = {
  color: string;
};

/**
 * BaseController is an abstract class. In order to test its methods
 * we need to create a new class that extends BaseClass.
 */
class MockController extends BaseController<RequestDTO> {

  public async validate(): Promise<RequestDTO | false> {
    return Promise.resolve(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async executeImpl(requestDTO: RequestDTO): Promise<void> {
    return Promise.resolve(undefined);
  }

  /** provide access to the parent's ok method */
  public callOk(value: unknown) {
    this.ok(value);
  }

  /** provide access to the parent's created method */
  public callCreated(value: unknown) {
    this.created(value);
  }

  /** provide access to the parent's noContent method */
  public callNoContent() {
    this.noContent();
  }

  /** provide access to the parent's badRequest method */
  public callBadRequest(value?: string) {
    this.badRequest(value);
  }

  /** provide access to the parent's unauthorized method */
  public callUnauthorized(value?: string) {
    this.unauthorized(value);
  }
}

describe('BaseController', () => {
  let controller: MockController;
  let validate: jest.SpyInstance;
  let executeImpl: jest.SpyInstance;

  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      end: jest.fn(),
    } as unknown as Response;
    controller = new MockController(req, res);
    validate = jest.spyOn(controller, 'validate');
    executeImpl = jest.spyOn(controller, 'executeImpl');
  });

  describe('execute method', () => {

    describe('when validate resolves to false', () => {

      beforeEach(() => {
        validate.mockResolvedValue(false);
      });

      it('should not call the executeImpl method', async () => {
        await controller.execute();
        expect(executeImpl).not.toHaveBeenCalled();
      });
    });

    describe('when validate resolves to any other value', () => {
      let request: RequestDTO;

      beforeEach(() => {
        request = { color: 'blue' };
        validate.mockResolvedValue(request);
      });

      it('should call the executeImpl method with the correct parameters', async () => {
        await controller.execute();
        expect(executeImpl).toHaveBeenCalledTimes(1);
        expect(executeImpl).toHaveBeenCalledWith(request);
      });
    });
  });

  describe('ok method', () => {
    it('should send the correct response', async () => {
      const data = {
        id: faker.datatype.number(),
        message: faker.random.words(10),
      };
      await controller.execute();
      controller.callOk(data);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(data);
    });
  });

  describe('created method', () => {
    it('should send the correct response', async () => {
      const data = {
        id: faker.datatype.number(),
        message: faker.random.words(10),
      };
      await controller.execute();
      controller.callCreated(data);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(data);
    });
  });

  describe('noContent method', () => {
    it('should send the correct response', async () => {
      await controller.execute();
      controller.callNoContent();
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalledTimes(1);
      expect(res.end).toHaveBeenCalledWith();
    });
  });

  describe('badRequest method', () => {
    it('should send the correct response when a message is passed', async () => {
      await controller.execute();
      const message = faker.random.words();
      controller.callBadRequest(message);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(message);
    });

    it('should send the correct response when no message is passed', async () => {
      await controller.execute();
      controller.callBadRequest();
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith('Bad Request');
    });
  });

  describe('unauthorized method', () => {
    it('should send the correct response when a message is passed', async () => {
      await controller.execute();
      const message = faker.random.words();
      controller.callUnauthorized(message);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(message);
    });

    it('should send the correct response when no message is passed', async () => {
      await controller.execute();
      controller.callUnauthorized();
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith('Unauthorized');
    });
  });
});
