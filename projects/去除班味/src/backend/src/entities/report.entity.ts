import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('reports')
export class Report {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id: string;

  @Column({ type: 'varchar', length: 32 })
  reporterId: string;

  @ManyToOne(() => User, (user) => user.reports, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  @Column({ type: 'varchar', length: 32 })
  targetId: string;

  @Column({ type: 'varchar', length: 20 })
  targetType: string;

  @Column({ type: 'varchar', length: 20 })
  reasonType: string;

  @Column({ type: 'text', nullable: true })
  reasonText: string;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: string;

  @ManyToOne(() => Post, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'target_id' })
  targetPost: Post;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
