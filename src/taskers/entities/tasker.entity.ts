import { Skill } from 'src/skills/entities/skill.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tasker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  work_area: string;

  @Column({ type: 'text', nullable: true })
  experience: string;

  @Column({ type: 'int', default: 0 })
  completed_tasks: number;

  @Column({ type: 'float', default: 0 })
  rating_sum: number;

  @Column({ type: 'int', default: 0 })
  rating_count: number;

  @OneToOne(() => User, (user) => user.tasker)
  user: User;

  @ManyToMany(() => Skill, (skill) => skill.taskers)
  @JoinTable()
  skills: Skill[];

  @OneToMany(() => Task, (task) => task.tasker)
  applied_tasks: Task[];

  @ManyToMany(() => Task, (task) => task.taskers)
  tasks: Task[];

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @BeforeInsert()
  setDates() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  @BeforeUpdate()
  updateDates() {
    this.updated_at = new Date();
  }
}
