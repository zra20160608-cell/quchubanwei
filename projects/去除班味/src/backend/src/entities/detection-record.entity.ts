import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { UserPlan } from './user-plan.entity';
import { Post } from './post.entity';

export interface DetectionElement {
  id: string;
  name: string;
  category: string;
  weight: number;
  confidence: number;
  boundingBox?: number[];
}

export interface DetectionDimensions {
  fatigue: number;
  chaos: number;
  repetition: number;
  concentration: number;
}

@Entity('detection_records')
export class DetectionRecord {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id: string;

  @Column({ type: 'varchar', length: 32 })
  userId: string;

  @ManyToOne(() => User, (user) => user.detectionRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 500 })
  imageUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbUrl: string;

  @Column({ type: 'varchar', length: 20 })
  sceneType: string;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'varchar', length: 20 })
  level: string;

  @Column({ type: 'jsonb', default: [] })
  elements: DetectionElement[];

  @Column({ type: 'jsonb', default: {} })
  dimensions: DetectionDimensions;

  @Column({ type: 'jsonb', default: [] })
  comments: string[];

  @Column({ type: 'jsonb', default: {} })
  extraInfo: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  isShared: boolean;

  @Column({ type: 'int', default: 0 })
  shareCount: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  posterUrl: string;

  @Column({ type: 'varchar', length: 20, default: 'CREATED' })
  status: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  aiTaskId: string;

  @Column({ type: 'int', nullable: true })
  aiCostMs: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'completed_at' })
  completedAt: Date;

  @OneToOne(() => UserPlan, (plan) => plan.detectBefore)
  beforePlan: UserPlan;

  @OneToOne(() => UserPlan, (plan) => plan.detectAfter)
  afterPlan: UserPlan;

  @OneToOne(() => Post, (post) => post.detectReport)
  post: Post;
}
