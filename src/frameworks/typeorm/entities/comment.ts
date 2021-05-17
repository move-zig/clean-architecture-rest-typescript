import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Poster } from './poster';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  posterId!: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  parentId!: number | null;

  @Column()
  text!: string;

  @ManyToOne(() => Poster, poster => poster.comments)
  poster!: Poster;

  @ManyToOne(() => Comment, comment => comment.children)
  parent!: Comment;

  @OneToMany(() => Comment, comment => comment.parent)
  children!: Comment[];
}
