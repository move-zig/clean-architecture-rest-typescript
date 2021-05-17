import { connection } from '../../frameworks/typeorm';
import { Repository } from './repository';

export const repository = connection.then(c => new Repository(c));
