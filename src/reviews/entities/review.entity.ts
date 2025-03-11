import { Task } from 'src/tasks/entities/task.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @OneToOne(() => Task, (task) => task.review)
  @JoinColumn({ name: 'task_id' })
  task: Task;
}
