import { Connection, getRepository, Repository as TypeOrmRepository } from 'typeorm';

import { Comment } from '../../domain/comment';
import { PersistedComment } from '../../domain/persistedComment';
import { Comment as CommentEntity } from '../../frameworks/typeorm/entities/comment';
import { Post as PostEntity } from '../../frameworks/typeorm/entities/post';
import { Poster as PosterEntity } from '../../frameworks/typeorm/entities/poster';
import { RepositoryError } from './repositoryError';

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

  private readonly commentRepository: TypeOrmRepository<CommentEntity>;
  private readonly posterRepository: TypeOrmRepository<PosterEntity>;
  private readonly postRepository: TypeOrmRepository<PostEntity>;

  public constructor(connection: Connection) {
  // public constructor() {
    this.commentRepository = connection.getRepository(CommentEntity);
    this.posterRepository = connection.getRepository(PosterEntity);
    this.postRepository = connection.getRepository(PostEntity);
    // this.commentRepository = getRepository(CommentEntity);
    // this.posterRepository = getRepository(PosterEntity);
    // this.postRepository = getRepository(PostEntity);
  }

  public async load(commentId: number): Promise<PersistedComment | undefined> {
    let commentEntity: CommentEntity | undefined;
    try {
      commentEntity = await this.commentRepository.findOne(commentId);
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
    let commentEntity: CommentEntity | undefined;
    try {
      commentEntity = await this.commentRepository.findOne(commentId);
    } catch (err) {
      throw new RepositoryError('could not load comment');
    }
    if (commentEntity) {
      console.log(commentEntity);
      return new PersistedComment({
        id: commentEntity.id,
        postId: commentEntity.postId,
        posterId: commentEntity.posterId,
        text: commentEntity.text,
        parentId: commentEntity.parentId ?? undefined,
        children: commentEntity.children?.map(c => ({
          id: c.id,
          postId: c.postId,
          posterId: c.posterId,
          text: c.text,
          parentId: c.parentId ?? undefined,
        })),
      });
    }
  }

  public async add(comment: Comment): Promise<PersistedComment> {
    const commentEntity = new CommentEntity();
    commentEntity.text = comment.text;

    commentEntity.post = await this.postRepository.findOne(comment.postId);
    if (!commentEntity.post) {
      throw new CommentRepositoryAddPostNotFound();
    }

    commentEntity.poster = await this.posterRepository.findOne(comment.posterId);
    if (!commentEntity.poster) {
      throw new CommentRepositoryAddPosterNotFound();
    }

    if (typeof comment.parentId !== 'undefined') {
      commentEntity.parent = await this.commentRepository.findOne(comment.parentId);
      if (!commentEntity.parent) {
        throw new CommentRepositoryAddParentNotFound();
      }
    }

    let saved;
    try {
      saved = await this.commentRepository.save(commentEntity);
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
    let posterEntity: PosterEntity | undefined;
    try {
      posterEntity = await this.posterRepository.findOne(posterId);
    } catch (err) {
      throw new RepositoryError('could not load poster');
    }
    if (posterEntity) {
      let commentEntities: CommentEntity[];
      try {
        commentEntities = await this.commentRepository.find({ where: { posterId } });
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
