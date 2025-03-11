import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { UsersService } from 'src/users/users.service';
import { error } from 'console';
import { TaskersService } from 'src/taskers/taskers.service';
import { Status } from 'src/enum/Status.enum';
import { SkillsService } from 'src/skills/skills.service';
import { TaskActionService } from './task-action.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private readonly usersService: UsersService,
    private readonly taskersService: TaskersService,
    private readonly skillService: SkillsService,
    private readonly taskActionService: TaskActionService,
  ) {}
  async create(user_id: number, createTaskDto: CreateTaskDto) {
    const user = await this.usersService.findById(user_id);
    const skill = await this.skillService.findOne(createTaskDto.skill_id);

    const task = this.taskRepository.create({
      ...createTaskDto,
      user,
      skill,
    });

    this.taskActionService.notifyTaskers(task);
    return await this.taskRepository.save(task);
  }

  findAllForAdmin() {
    return this.taskRepository.find({
      relations: ['skill', 'user', 'tasker', 'taskers', 'review'],
      order: { created_at: 'DESC' },
    });
  }

  async findAllForUser() {
    return await this.taskRepository.find({
      where: { task_status: Status.POSTED },
      relations: ['skill'],
      order: { created_at: 'DESC' },
    });
  }

  async findUserTasks(user_id: number) {
    const user = await this.usersService.findById(user_id).catch(() => {
      throw new NotFoundException('User not found');
    });

    return this.taskRepository.find({
      where: { user: { id: user.id } },
      relations: [
        'tasker',
        'skill',
        'taskers',
        'taskers.skills',
        'tasker.skills',
        'review',
      ],
      order: { created_at: 'DESC' },
    });
  }

  async findTaskerTasks(tasker_id: number) {
    const tasker = await this.taskersService.findOne(tasker_id);

    return this.taskRepository.find({
      where: { tasker: { id: tasker.id } },
      relations: ['user', 'skill', 'review'],
      order: { created_at: 'DESC' },
    });
  }

  findOne(id: number) {
    const task = this.taskRepository.findOne({
      where: { id },
      relations: ['skill'],
    });
    if (!task) {
      throw error;
    }

    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    const {
      title,
      description,
      district,
      ward,
      detail_address,
      estimated_duration,
      fee_per_hour,
    } = updateTaskDto;

    return this.taskRepository.update(id, {
      title,
      description,
      district,
      ward,
      detail_address,
      estimated_duration,
      fee_per_hour,
    });
  }

  async remove(user_id: number, id: number) {
    try {
      if (!user_id) {
        throw new ForbiddenException('You must be a user to delete a task');
      }

      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      if (task.user.id !== user_id) {
        throw new ForbiddenException('You can only delete your own tasks');
      }

      task.task_status = Status.CANCELLED;
      return this.taskRepository.save(task);
    } catch (e) {
      throw e;
    }
  }
}
