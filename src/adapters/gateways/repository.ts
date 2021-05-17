import { Connection, Repository as TypeOrmRepository } from 'typeorm';

import { Comment } from '../../domain/comment';
import { PersistedComment } from '../../domain/persistedComment';
import { Poster } from '../../domain/poster';
import { Comment as CommentEntity } from '../../frameworks/typeorm/entities/comment';
import { Poster as PosterEntity } from '../../frameworks/typeorm/entities/poster';
import { RepositoryError } from './repositoryError';

export interface IRepository {
  loadPoster: (posterId: number) => Promise<Poster | undefined>;
  loadComment: (commentId: number) => Promise<PersistedComment | undefined>;
  addComment: (comment: Comment) => Promise<PersistedComment>;
  loadCommentsByPoster: (posterId: number) => Promise<PersistedComment[] | undefined>;
}

export class Repository implements IRepository {

  private readonly commentRepository: TypeOrmRepository<CommentEntity>;
  private readonly posterRepository: TypeOrmRepository<PosterEntity>;

  public constructor(connection: Connection) {
    this.commentRepository = connection.getRepository(CommentEntity);
    this.posterRepository = connection.getRepository(PosterEntity);
  }

  public async loadPoster(posterId: number): Promise<Poster | undefined> {
    let posterEntity: PosterEntity | undefined;
    try {
      posterEntity = await this.posterRepository.findOne(posterId);
    } catch (err) {
      throw new RepositoryError('could not load poster');
    }
    if (posterEntity) {
      return new Poster({
        id: posterEntity.id,
        name: posterEntity.name,
        disabled: posterEntity.disabled,
      });
    }
  }

  public async loadComment(commentId: number): Promise<PersistedComment | undefined> {
    let commentEntity: CommentEntity | undefined;
    try {
      commentEntity = await this.commentRepository.findOne(commentId);
    } catch (err) {
      throw new RepositoryError('could not load comment');
    }
    if (commentEntity) {
      return new PersistedComment({
        id: commentEntity.id,
        posterId: commentEntity.posterId,
        text: commentEntity.text,
        parentId: commentEntity.parentId ?? undefined,
      });
    }
  }

  public async addComment(comment: Comment): Promise<PersistedComment> {
    const commentEntity = new CommentEntity();
    commentEntity.posterId = comment.posterId;
    commentEntity.parentId = comment.parentId ?? null;
    commentEntity.text = comment.text;
    let saved;
    try {
      saved = await this.commentRepository.save(commentEntity);
    } catch (err: unknown) {
      throw new RepositoryError('could not save comment');
    }
    return new PersistedComment({
      id: saved.id,
      posterId: saved.posterId,
      text: saved.text,
      parentId: saved.parentId ?? undefined,
    });
  }

  public async loadCommentsByPoster(posterId: number): Promise<PersistedComment[] | undefined> {
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
        posterId: c.posterId,
        parentId: c.parentId ?? undefined,
        text: c.text,
      }));
    }
  }
}
