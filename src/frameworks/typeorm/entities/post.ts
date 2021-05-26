import typeorm from 'typeorm';

import { Comment } from './comment';
import { Poster } from './poster';

const { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } = typeorm;

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'int',
  })
  posterId!: number;

  @Column({
    type: 'longtext',
  })
  text!: string;

  @ManyToOne(() => Poster, poster => poster.comments)
  poster?: Poster;

  @OneToMany(() => Comment, comment => comment.post)
  comments?: Comment[];
}
