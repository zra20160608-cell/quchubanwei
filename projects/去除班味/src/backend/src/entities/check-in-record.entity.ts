import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { UserPlan } from './user-plan.entity';

@Entity('check_in_records')
export class CheckInRecord {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id: string;

  @Column({ type: 'varchar', length: 32 })
  userId: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 32 })
  userPlanId: string;

  @ManyToOne(() => UserPlan, (plan) => plan.checkInRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_plan_id' })
  userPlan: UserPlan;

  @Column({ type: 'varchar', length: 32 })
  actionId: string;

  @Column({ type: 'int' })
  dayNumber: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  mood: string;

  @Column({ type: 'boolean', default: false })
  isMakeUp: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true })
  makeUpReason: string;

  @Column({ type: 'int', default: 0 })
  expEarned: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
