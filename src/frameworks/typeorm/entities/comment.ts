import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post';
import { Poster } from './poster';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'int',
  })
  postId!: number;

  @Column({
    type: 'int',
  })
  posterId!: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  parentId!: number | null;

  @Column({
    type: 'varchar',
    length: 191,
  })
  text!: string;

  @ManyToOne(() => Post, post => post.comments)
  post?: Post;

  @ManyToOne(() => Poster, poster => poster.comments)
  poster?: Poster;

  @ManyToOne(() => Comment, comment => comment.children, { nullable: true })
  parent?: Comment | null;

  @OneToMany(() => Comment, comment => comment.parent)
  children?: Comment[];
}
