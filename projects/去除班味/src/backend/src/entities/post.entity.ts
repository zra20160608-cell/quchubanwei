import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { Collection } from './collection.entity';
import { DetectionRecord } from './detection-record.entity';
import { UserPlan } from './user-plan.entity';

@Entity('posts')
export class Post {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id: string;

  @Column({ type: 'varchar', length: 32 })
  userId: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 20, default: 'POST' })
  type: string;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: string;

  @Column({ type: 'text', nullable: true })
  text: string;

  @Column({ type: 'jsonb', default: [] })
  images: string[];

  @Column({ type: 'jsonb', default: [] })
  topicTags: string[];

  @Column({ type: 'varchar', length: 32, nullable: true })
  detectReportId: string;

  @OneToOne(() => DetectionRecord)
  @JoinColumn({ name: 'detect_report_id' })
  detectReport: DetectionRecord;

  @Column({ type: 'varchar', length: 32, nullable: true })
  planProgressId: string;

  @OneToOne(() => UserPlan)
  @JoinColumn({ name: 'plan_progress_id' })
  planProgress: UserPlan;

  @Column({ type: 'boolean', default: false })
  isAnonymous: boolean;

  @Column({ type: 'boolean', default: false })
  isPinned: boolean;

  @Column({ type: 'int', default: 0, name: 'like_count' })
  likeCount: number;

  @Column({ type: 'int', default: 0, name: 'comment_count' })
  commentCount: number;

  @Column({ type: 'int', default: 0, name: 'collect_count' })
  collectCount: number;

  @Column({ type: 'int', default: 0, name: 'share_count' })
  shareCount: number;

  @Column({ type: 'int', default: 0, name: 'view_count' })
  viewCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  sortScore: number;

  @Column({ type: 'timestamptz', nullable: true, name: 'published_at' })
  publishedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Collection, (collection) => collection.post)
  collections: Collection[];
}
