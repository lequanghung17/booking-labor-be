import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Tasker } from 'src/taskers/entities/tasker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Task, Tasker])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
