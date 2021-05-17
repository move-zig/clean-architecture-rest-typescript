import { Connection, Repository as TypeOrmRepository } from 'typeorm';

import { PersistedPoster } from '../../domain/persistedPoster';
import { Poster as PosterEntity } from '../../frameworks/typeorm/entities/poster';
import { RepositoryError } from './repositoryError';

export interface IPosterRepository {
  load: (posterId: number) => Promise<PersistedPoster | undefined>;
}

export class PosterRepository implements IPosterRepository {

  private readonly posterRepository: TypeOrmRepository<PosterEntity>;

  public constructor(connection: Connection) {
    this.posterRepository = connection.getRepository(PosterEntity);
  }

  public async load(posterId: number): Promise<PersistedPoster | undefined> {
    let posterEntity: PosterEntity | undefined;
    try {
      posterEntity = await this.posterRepository.findOne(posterId);
    } catch (err) {
      throw new RepositoryError('could not load comment');
    }
    if (posterEntity) {
      return new PersistedPoster({
        id: posterEntity.id,
        name: posterEntity.name,
        disabled: posterEntity.disabled,
        signUpDate: posterEntity.signUpDate,
      });
    }
  }
}
