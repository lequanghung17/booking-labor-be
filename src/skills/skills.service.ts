import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    try {
      const { name } = createSkillDto;

      const skill = await this.skillRepository.findOne({ where: { name } });

      if (skill) {
        throw new ConflictException('Skill already exists');
      }

      this.skillRepository.create(createSkillDto);
      return await this.skillRepository.save(createSkillDto);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.skillRepository.find();
  }

  findOne(id: number) {
    const skill = this.skillRepository.findOne({ where: { id } });
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return skill;
  }

  async findByIds(ids: number[]): Promise<Skill[]> {
    if (!ids && ids.length === 0) {
      throw new ConflictException('No skill ids provided');
    }

    const skills = await this.skillRepository.find({
      where: { id: In(ids) },
    });

    if (!skills) {
      throw new NotFoundException('Skills not found');
    }

    return skills;
  }

  async update(id: number, updateSkillDto: UpdateSkillDto) {
    try {
      const skill = this.skillRepository.findOne({ where: { id } });

      if (!skill) {
        throw new NotFoundException('Skill not found');
      }

      return await this.skillRepository.update(id, updateSkillDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  remove(id: number) {
    try {
      const skill = this.skillRepository.findOne({ where: { id } });

      if (!skill) {
        throw new NotFoundException('Skill not found');
      }

      return this.skillRepository.delete(id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
