/**
 * Express doesn't support async request handlers. Rather than putting a
 * try...catch into each handler, we can reduce boilerplate by wrapping
 * each handler with a function that takes an async request handler and
 * returns a synchronous request handler.
 */

import type { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * Takes an async request handler and returns a synchronous event
 * handler.
 *
 * The returned event handler calls the original async request
 * handler and catches any errors and passes them to the NextFunction.
 *
 * @param fn an async request handler
 * @returns a synchronous event handler
 */
export const asyncWrapper = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // eslint-disable-next-line promise/no-callback-in-promise
    fn(req, res, next).catch(err => next(err));
  };
};
