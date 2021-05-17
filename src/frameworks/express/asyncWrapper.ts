import { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const asyncWrapper = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // eslint-disable-next-line promise/no-callback-in-promise
    fn(req, res, next).catch(err => next(err));
  };
};
