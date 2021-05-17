import { connection } from '../../frameworks/typeorm';
import { CommentRepository } from './commentRepository';
import { PosterRepository } from './posterRepository';

export const repository = connection.then(c => ({
  posterRepository: new PosterRepository(c),
  commentRepository: new CommentRepository(c),
}));
