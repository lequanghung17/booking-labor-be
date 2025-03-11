import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskerDto } from './dto/create-tasker.dto';
import { UpdateTaskerDto } from './dto/update-tasker.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasker } from './entities/tasker.entity';
import { Repository } from 'typeorm';
import { SkillsService } from 'src/skills/skills.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TaskersService {
  constructor(
    @InjectRepository(Tasker)
    private taskerRepository: Repository<Tasker>,
    private readonly skillsService: SkillsService,
    private readonly usersService: UsersService,
  ) {}

  convertArrayToString(numbers: number[]): string {
    return numbers.join(', ');
  }

  async create(
    user_id: number,
    createTaskerDto: CreateTaskerDto,
  ): Promise<Tasker> {
    try {
      const { skillIds, work_area, experience, ...rest } = createTaskerDto;

      const work_area_code = this.convertArrayToString(work_area);

      const skills = await this.skillsService.findByIds(skillIds);

      const user = await this.usersService.findById(user_id);

      if (user.tasker) {
        throw new ConflictException('User is already a tasker');
      }

      const tasker = this.taskerRepository.create({
        ...createTaskerDto,
        work_area: work_area_code,
        user,
        skills,
      });

      return this.taskerRepository.save(tasker);
    } catch (error) {
      throw error;
    }
  }

  findAll(): Promise<Tasker[]> {
    return this.taskerRepository.find({
      relations: ['skills', 'user', 'user.profile'],
    });
  }

  findOne(id: number): Promise<Tasker> {
    try {
      const tasker = this.taskerRepository.findOne({
        where: { id },
        relations: ['skills'],
      });

      if (!tasker) {
        throw new NotFoundException('Tasker not found');
      }

      return tasker;
    } catch (error) {
      throw error;
    }
  }

  async getAllTaskerData(id: number): Promise<Tasker> {
    const tasker = await this.taskerRepository.findOne({
      where: { id },
      relations: ['skills', 'user', 'user.profile'],
    });

    return tasker;
  }

  async update(id: number, updateTaskerDto: UpdateTaskerDto) {
    const { skillIds, work_area, ...rest } = updateTaskerDto;

    const work_area_code = this.convertArrayToString(work_area);

    const tasker = await this.taskerRepository.findOne({
      where: { id },
      relations: ['skills'],
    });

    if (!tasker) {
      throw new NotFoundException('Tasker not found');
    }

    // Kiểm tra nếu skillIds tồn tại và không rỗng
    if (skillIds && skillIds.length > 0) {
      const skills = await this.skillsService.findByIds(skillIds);
      tasker.skills = skills;
    }

    return this.taskerRepository.save({
      ...tasker,
      work_area: work_area_code,
      ...rest,
    });
  }

  updateCompletedTasks(id: number) {
    return this.taskerRepository.update(
      { id },
      { completed_tasks: () => 'completed_tasks + 1' },
    );
  }

  remove(id: number) {
    return this.taskerRepository.delete({ id });
  }
}
