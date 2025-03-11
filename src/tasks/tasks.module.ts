import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UsersModule } from 'src/users/users.module';
import { TaskersModule } from 'src/taskers/taskers.module';
import { TaskActionService } from './task-action.service';
import { SkillsModule } from 'src/skills/skills.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UsersModule,
    TaskersModule,
    SkillsModule,
    NotificationsModule,
    EmailModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskActionService],
  exports: [TasksService],
})
export class TasksModule {}
