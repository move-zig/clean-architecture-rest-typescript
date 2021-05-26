import p from '@prisma/client';

import { CommentRepository } from './commentRepository';
import { PosterRepository } from './posterRepository';

const prisma = new p.PrismaClient();

export const posterRepository = new PosterRepository(prisma);
export const commentRepository = new CommentRepository(prisma);
