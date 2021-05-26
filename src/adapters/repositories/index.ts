import { PrismaClient } from '@prisma/client';

import { CommentRepository } from './commentRepository';
import { PosterRepository } from './posterRepository';

const prisma = new PrismaClient();

export const posterRepository = new PosterRepository(prisma);
export const commentRepository = new CommentRepository(prisma);
