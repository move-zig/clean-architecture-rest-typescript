import express from 'express';
import { addCommentController, getAllCommentsByPosterController, getCommentController } from '../../adapters/controllers';
import { asyncWrapper } from './asyncWrapper';

const router = express.Router();

router.post('/comments', asyncWrapper(async (req, res) => addCommentController.execute(req, res)));
router.get('/comments', asyncWrapper(async (req, res) => getAllCommentsByPosterController.execute(req, res)));
router.get('/comments/:commentId', asyncWrapper(async (req, res) => getCommentController.execute(req, res)));

export { router };
