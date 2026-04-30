import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DetectionRecord } from './detection-record.entity';
import { UserPlan } from './user-plan.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Collection } from './collection.entity';
import { Notification } from './notification.entity';
import { ShareRecord } from './share-record.entity';
import { InviteRelation } from './invite-relation.entity';
import { UserAchievement } from './user-achievement.entity';
import { Report } from './report.entity';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id: string;

  @Column({ type: 'varchar', length: 32, unique: true, nullable: true })
  unionId: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  openId: string;

  @Column({ type: 'varchar', length: 50, default: '职场新人' })
  nickname: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarUrl: string;

  @Column({ type: 'smallint', default: 0 })
  gender: number;

  @Column({ type: 'jsonb', default: {} })
  profile: {
    preferredScene?: string;
    avgScore?: number;
    scoreTrend?: string;
    activeTags?: string[];
    persona?: string;
    riskLevel?: string;
  };

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ type: 'int', default: 0 })
  exp: number;

  @Column({ type: 'int', default: 0, name: 'check_in_streak' })
  checkInStreak: number;

  @Column({ type: 'int', default: 0, name: 'total_detections' })
  totalDetections: number;

  @Column({ type: 'int', default: 0, name: 'total_posts' })
  totalPosts: number;

  @Column({ type: 'int', default: 0, name: 'total_likes' })
  totalLikes: number;

  @Column({ type: 'int', default: 0, name: 'total_comments' })
  totalComments: number;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  inviteCode: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  invitedBy: string;

  @ManyToOne(() => User, (user) => user.invitees, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'invited_by' })
  inviter: User;

  @OneToMany(() => User, (user) => user.inviter)
  invitees: User[];

  @Column({ type: 'smallint', default: 1 })
  status: number;

  @Column({ type: 'timestamptz', nullable: true, name: 'last_login_at' })
  lastLoginAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => DetectionRecord, (record) => record.user)
  detectionRecords: DetectionRecord[];

  @OneToMany(() => UserPlan, (plan) => plan.user)
  userPlans: UserPlan[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Collection, (collection) => collection.user)
  collections: Collection[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Notification, (notification) => notification.sender)
  sentNotifications: Notification[];

  @OneToMany(() => ShareRecord, (record) => record.user)
  shareRecords: ShareRecord[];

  @OneToMany(() => InviteRelation, (relation) => relation.inviter)
  sentInvites: InviteRelation[];

  @OneToMany(() => InviteRelation, (relation) => relation.invitee)
  receivedInvites: InviteRelation[];

  @OneToMany(() => UserAchievement, (ua) => ua.user)
  achievements: UserAchievement[];

  @OneToMany(() => Report, (report) => report.reporter)
  reports: Report[];
}
