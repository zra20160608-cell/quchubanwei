import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('invite_relations')
export class InviteRelation {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id: string;

  @Column({ type: 'varchar', length: 32 })
  inviterId: string;

  @ManyToOne(() => User, (user) => user.sentInvites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inviter_id' })
  inviter: User;

  @Column({ type: 'varchar', length: 32 })
  inviteeId: string;

  @ManyToOne(() => User, (user) => user.receivedInvites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitee_id' })
  invitee: User;

  @Column({ type: 'varchar', length: 20 })
  inviteCode: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  inviteChannel: string;

  @Column({ type: 'boolean', default: false })
  isRewarded: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  rewardedAt: Date;

  @Column({ type: 'int', default: 0 })
  rewardExp: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
