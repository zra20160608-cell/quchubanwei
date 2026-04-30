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
import { PlanTemplate } from './plan-template.entity';
import { DetectionRecord } from './detection-record.entity';
import { CheckInRecord } from './check-in-record.entity';
import { Post } from './post.entity';

@Entity('user_plans')
export class UserPlan {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id: string;

  @Column({ type: 'varchar', length: 32 })
  userId: string;

  @ManyToOne(() => User, (user) => user.userPlans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 32 })
  planTemplateId: string;

  @ManyToOne(() => PlanTemplate, (pt) => pt.userPlans)
  @JoinColumn({ name: 'plan_template_id' })
  planTemplate: PlanTemplate;

  @Column({ type: 'varchar', length: 100 })
  planName: string;

  @Column({ type: 'varchar', length: 20 })
  category: string;

  @Column({ type: 'varchar', length: 20, default: 'NOT_STARTED' })
  status: string;

  @Column({ type: 'int', default: 0 })
  currentDay: number;

  @Column({ type: 'int' })
  totalDays: number;

  @Column({ type: 'int', default: 0 })
  completedDays: number;

  @Column({ type: 'int', default: 0 })
  missedDays: number;

  @Column({ type: 'int', default: 0 })
  makeUpDays: number;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date;

  @Column({ type: 'varchar', length: 32, nullable: true })
  detectBeforeId: string;

  @OneToOne(() => DetectionRecord)
  @JoinColumn({ name: 'detect_before_id' })
  detectBefore: DetectionRecord;

  @Column({ type: 'varchar', length: 32, nullable: true })
  detectAfterId: string;

  @OneToOne(() => DetectionRecord)
  @JoinColumn({ name: 'detect_after_id' })
  detectAfter: DetectionRecord;

  @Column({ type: 'time', nullable: true })
  remindTime: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CheckInRecord, (record) => record.userPlan)
  checkInRecords: CheckInRecord[];

  @OneToOne(() => Post, (post) => post.planProgress)
  post: Post;
}
