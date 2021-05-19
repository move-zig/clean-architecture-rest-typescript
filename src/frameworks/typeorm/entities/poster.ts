import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment';

@Entity()
export class Poster {
  @PrimaryGeneratedColumn()
  id!: number;

  /** a date string 'yyyy-mm-dd' */
  @Column({
    type: 'date',
  })
  signUpDate!: string;

  @Column({
    type: 'varchar',
    length: 191,
  })
  name!: string;

  @Column({
    type: 'boolean',
    width: 1,
    default: 0,
  })
  disabled!: boolean;

  @OneToMany(() => Comment, comment => comment.poster)
  comments!: Comment[];
}
