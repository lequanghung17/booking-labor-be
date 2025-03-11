import { Module } from '@nestjs/common';
import { TaskersService } from './taskers.service';
import { TaskersController } from './taskers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasker } from './entities/tasker.entity';
import { UsersModule } from 'src/users/users.module';
import { SkillsModule } from 'src/skills/skills.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tasker]), UsersModule, SkillsModule],
  controllers: [TaskersController],
  providers: [TaskersService],
  exports: [TaskersService],
})
export class TaskersModule {}
