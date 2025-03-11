import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { omit, Omit } from 'lodash';
import { Role } from 'src/enum/Role.enum';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const { email, password, role, ...rest } = createUserDto;
      const hash_password = await bcrypt.hash(password, 10);

      const existsUser = await this.usersRepository.findOne({
        where: { email },
      });

      if (existsUser) {
        throw new ConflictException('User with email already exists');
      }

      const user = this.usersRepository.create({
        ...rest,
        email: email,
        password: hash_password,
        role: role || Role.USER,
      });

      const exitsProfile = await this.profileRepository.findOne({
        where: { phone_number: createUserDto.phone_number },
      });

      if (exitsProfile) {
        throw new ConflictException('User with phone_number already exists');
      }

      const birth_date = new Date(createUserDto.date_of_birth);

      const profile = this.profileRepository.create({
        user: user,
        birth_date,
        ...createUserDto,
      });

      user.profile = profile;

      await this.profileRepository.save(profile);
      await this.usersRepository.save(user);

      return omit(user, 'password');
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    try {
      const users = await this.usersRepository.find({
        relations: ['profile', 'tasker', 'tasker.skills'],
      });

      return users.map((user) => omit(user, 'password'));
    } catch (error) {
      throw error;
    }
  }

  async findAllAdmin(): Promise<Omit<User, 'password'>[]> {
    try {
      const users = await this.usersRepository.find({
        where: { role: Role.ADMIN },
        relations: ['profile', 'tasker', 'tasker.skills'],
      });

      return users;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['profile', 'tasker', 'tasker.skills'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return omit(user, ['password']);
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
        relations: ['profile'],
      });

      if (user === undefined) {
        throw new NotFoundException('User not found');
      }

      return this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by email for authentication
   * @param email
   * @returns user with password
   */
  findByEmailForAuth(email: string): Promise<User> {
    try {
      const user = this.usersRepository.findOne({
        where: { email },
        relations: ['profile', 'tasker', 'tasker.skills'],
      });

      if (user) {
        return user;
      }

      throw new NotFoundException('User not found at users service');
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['profile'],
      });
      const profile = await this.profileRepository.findOne({
        where: { user: { id } },
      });
      const { password, ...rest } = updateUserDto;

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user) {
        throw new NotFoundException('Profile not found');
      }

      if (password) {
        const hash_password = await bcrypt.hash(password, 10);
        const res = await this.usersRepository.update(
          { id },
          { password: hash_password },
        );

        if (res.affected === 0) {
          throw new NotFoundException('User not found');
        }
        return omit(
          await this.usersRepository.findOne({
            where: { id },
            relations: ['profile'],
          }),
          'password',
        );
      }

      const res = await this.profileRepository.update({ id }, rest);
      return omit(
        await this.usersRepository.findOne({
          where: { id },
          relations: ['profile'],
        }),
        ['password'],
      );
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['profile'],
      });

      if (user === undefined) {
        throw new NotFoundException('User not found');
      }

      this.profileRepository.delete({ id: user.profile.id });
      this.usersRepository.delete({ id });
    } catch (error) {
      throw error;
    }
  }
}
