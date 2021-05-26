import { Comment } from '../../domain/comment';
import { PersistedComment } from '../../domain/persistedComment';
import { RepositoryError } from './repositoryError';
import type { comment as CommentEntity, poster as PosterEntity, PrismaClient } from '.prisma/client';

/** Couldn't find the post when adding a comment */
export class CommentRepositoryAddPostNotFound extends Error { }
/** Couldn't find the poster when adding a comment */
export class CommentRepositoryAddPosterNotFound extends Error { }
/** Couldn't find the parent when adding a comment */
export class CommentRepositoryAddParentNotFound extends Error { }

export interface ICommentRepository {
  load: (commentId: number) => Promise<PersistedComment | undefined>;
  loadWithChildren: (commentId: number) => Promise<PersistedComment | undefined>;
  add: (comment: Comment) => Promise<PersistedComment>;
  loadAllByPoster: (posterId: number) => Promise<PersistedComment[] | undefined>;
}

export class CommentRepository implements ICommentRepository {

  public constructor(private readonly prisma: PrismaClient) { /* empty */ }

  public async load(commentId: number): Promise<PersistedComment | undefined> {
    let commentEntity: CommentEntity | null;
    try {
      commentEntity = await this.prisma.comment.findUnique({ where: { id: commentId } });
    } catch (err) {
      throw new RepositoryError('could not load comment');
    }
    if (commentEntity) {
      return new PersistedComment({
        id: commentEntity.id,
        postId: commentEntity.postId,
        posterId: commentEntity.posterId,
        text: commentEntity.text,
        parentId: commentEntity.parentId ?? undefined,
      });
    }
  }

  public async loadWithChildren(commentId: number): Promise<PersistedComment | undefined> {
    let commentEntity: CommentEntity | null;
    try {
      commentEntity = await this.prisma.comment.findUnique({ where: { id: commentId } });
    } catch (err) {
      throw new RepositoryError('could not load comment');
    }
    if (commentEntity) {
      return new PersistedComment({
        id: commentEntity.id,
        postId: commentEntity.postId,
        posterId: commentEntity.posterId,
        text: commentEntity.text,
        parentId: commentEntity.parentId ?? undefined,
        // children: commentEntity.children?.map(c => ({
        //   id: c.id,
        //   postId: c.postId,
        //   posterId: c.posterId,
        //   text: c.text,
        //   parentId: c.parentId ?? undefined,
        // })),
      });
    }
  }

  public async add(comment: Comment): Promise<PersistedComment> {
    const [ postEntity, posterEntity ] = await Promise.all([
      this.prisma.post.findUnique({ where: { id: comment.postId } }),
      this.prisma.poster.findUnique({ where: { id: comment.posterId } }),
    ]);

    if (!postEntity) {
      throw new CommentRepositoryAddPostNotFound();
    }
    if (!posterEntity) {
      throw new CommentRepositoryAddPosterNotFound();
    }

    if (comment.parentId) {
      const parentEntity = await this.prisma.comment.findUnique({ where: { id: comment.parentId } });
      if (!parentEntity) {
        throw new CommentRepositoryAddParentNotFound();
      }
    }

    let saved: CommentEntity;
    try {
      saved = await this.prisma.comment.create({
        data: {
          postId: comment.postId,
          posterId: comment.posterId,
          text: comment.text,
          parentId: comment.parentId,
        },
      });
    } catch (err: unknown) {
      throw new RepositoryError('could not save comment');
    }

    return new PersistedComment({
      id: saved.id,
      postId: saved.postId,
      posterId: saved.posterId,
      text: saved.text,
      parentId: saved.parentId ?? undefined,
    });
  }

  public async loadAllByPoster(posterId: number): Promise<PersistedComment[] | undefined> {
    let posterEntity: PosterEntity | null;
    try {
      posterEntity = await this.prisma.poster.findUnique({ where: { id: posterId } });
    } catch (err) {
      throw new RepositoryError('could not load poster');
    }
    if (posterEntity) {
      let commentEntities: CommentEntity[];
      try {
        commentEntities = await this.prisma.comment.findMany({ where: { posterId } });
      } catch (err) {
        throw new RepositoryError('could not load comments');
      }
      return commentEntities.map(c => new PersistedComment({
        id: c.id,
        postId: c.postId,
        posterId: c.posterId,
        parentId: c.parentId ?? undefined,
        text: c.text,
      }));
    }
  }
}
