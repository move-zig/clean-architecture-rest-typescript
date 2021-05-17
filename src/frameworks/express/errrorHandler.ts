import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  console.error(err);
  if (!res.headersSent) {
    res.status(500).send(err.message);
  } else {
    next(err);
  }
};
