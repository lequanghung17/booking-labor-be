import { Status } from 'src/enum/Status.enum';
import { Review } from 'src/reviews/entities/review.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { Tasker } from 'src/taskers/entities/tasker.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: Status, default: Status.POSTED })
  task_status: Status;

  @Column({ type: 'varchar', length: 255, nullable: false })
  district: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  ward: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  detail_address: string;

  @Column({ type: 'int', nullable: false })
  estimated_duration: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fee_per_hour: string;

  @Column({ type: 'timestamp', nullable: false })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: false })
  end_date: Date;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @BeforeInsert()
  setDefaults(): void {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  @BeforeUpdate()
  setUpdatedAt(): void {
    this.updated_at = new Date();
  }

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Tasker, (tasker) => tasker.tasks)
  @JoinTable()
  taskers: Tasker[];

  @ManyToOne(() => Tasker, (tasker) => tasker.applied_tasks)
  @JoinColumn({ name: 'tasker_id' })
  tasker: Tasker;

  @ManyToOne(() => Skill)
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @OneToOne(() => Review, (review) => review.task)
  review: Review;
}
