import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment';

@Entity()
export class Poster {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'date',
  })
  signUpDate!: Date;

  @Column()
  name!: string;

  @Column()
  disabled!: boolean;

  @OneToMany(() => Comment, comment => comment.poster)
  comments!: Comment[];
}
