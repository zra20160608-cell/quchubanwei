import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { UserPlan } from './user-plan.entity';

@Entity('plan_templates')
export class PlanTemplate {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  category: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  color: string;

  @Column({ type: 'int', default: 7 })
  totalDays: number;

  @Column({ type: 'jsonb', default: [] })
  matchRules: Array<{
    elementId: string;
    minScore: number;
    weight: number;
  }>;

  @Column({ type: 'jsonb', default: [] })
  actions: Array<{
    id: string;
    day: number;
    title: string;
    description: string;
    duration: string;
  }>;

  @Column({ type: 'jsonb', default: {} })
  expectedEffect: Record<string, any>;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserPlan, (up) => up.planTemplate)
  userPlans: UserPlan[];
}
