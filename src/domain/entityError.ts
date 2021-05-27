import { Entity } from '.';

export class EntityError extends Error {

  public constructor(message: string, public readonly entity: Entity) {
    super(message);
  }
}
