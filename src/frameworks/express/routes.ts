import express from 'express';

import { AddCommentController } from '../../adapters/controllers/addCommentController';
import { GetAllCommentsByPosterController } from '../../adapters/controllers/getAllCommentsByPosterController';
import { GetCommentController } from '../../adapters/controllers/getCommentController';
import { asyncWrapper } from './asyncWrapper';

const router = express.Router();

router.post('/comments', asyncWrapper(async (req, res) => {
  const controller = new AddCommentController(req, res);
  await controller.execute();
}));

router.get('/comments', asyncWrapper(async (req, res) => {
  const controller = new GetAllCommentsByPosterController(req, res);
  await controller.execute();
}));

router.get('/comments/:commentId', asyncWrapper(async (req, res) => {
  const controller = new GetCommentController(req, res);
  await controller.execute();
}));

export { router };
