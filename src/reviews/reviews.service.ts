import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Status } from 'src/enum/Status.enum';
import { Tasker } from 'src/taskers/entities/tasker.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Tasker)
    private taskerRepository: Repository<Tasker>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}
  async create(createReviewDto: CreateReviewDto, user_id: number) {
    try {
      const { task_id } = createReviewDto;

      const task = await this.taskRepository.findOne({
        where: { id: task_id },
        relations: ['user', 'tasker', 'review'],
      });

      if (task.review) {
        throw new ConflictException('You have already reviewed this task');
      }

      if (task.task_status !== Status.COMPLETED) {
        throw new ForbiddenException('You are not allowed to review this task');
      }

      if (task.user.id !== user_id) {
        throw new ForbiddenException('You are not allowed to review this task');
      }

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      const review = this.reviewRepository.create(createReviewDto);
      review.task = task;
      const res = await this.reviewRepository.save(review);

      const tasker = await this.taskerRepository.findOne({
        where: { id: task.tasker.id },
      });

      tasker.rating_sum += createReviewDto.rating;
      tasker.rating_count += 1;

      await this.taskerRepository.save(tasker);
      return res;
    } catch (error) {
      throw error;
    }
  }

  // Find all reviews of a tasker
  findAll(tasker_id: number) {
    const reviews = this.reviewRepository.find({
      where: { task: { tasker: { id: tasker_id } } },
      relations: ['task', 'task.skill'],
    });

    return reviews;
  }

  findOne(task_id: number) {
    const review = this.reviewRepository.findOne({
      where: { task: { id: task_id } },
      relations: ['task', 'task.skill'],
    });
    return review;
  }
}
