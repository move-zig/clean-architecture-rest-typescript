import { PersistedPoster } from '../../domain/persistedPoster';
import { RepositoryError } from './repositoryError';
import type { poster as PosterEntity, PrismaClient } from '.prisma/client';

export interface IPosterRepository {
  load: (posterId: number) => Promise<PersistedPoster | undefined>;
}

export class PosterRepository implements IPosterRepository {

  public constructor(private readonly prisma: PrismaClient) { /* empty */ }

  public async load(posterId: number): Promise<PersistedPoster | undefined> {
    let posterEntity: PosterEntity | null;
    try {
      posterEntity = await this.prisma.poster.findUnique({ where: { id: posterId } });
    } catch (err) {
      throw new RepositoryError('could not load comment');
    }
    if (posterEntity) {
      return new PersistedPoster({
        id: posterEntity.id,
        name: posterEntity.name,
        disabled: posterEntity.disabled,
        signUpDate: new Date(posterEntity.signUpDate),
      });
    }
  }
}
