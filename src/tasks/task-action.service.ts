import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { TaskersService } from 'src/taskers/taskers.service';
import { UsersService } from 'src/users/users.service';
import { Status } from 'src/enum/Status.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationType } from 'src/enum/Notification.enum';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Tasker } from 'src/taskers/entities/tasker.entity';
import EmailService from 'src/email/email.service';

@Injectable()
export class TaskActionService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private readonly usersService: UsersService,
    private readonly taskersService: TaskersService,
    private readonly emitter: EventEmitter2,
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Thông báo cho các tasker cùng khu vực khi có task mới
   */
  async notifyTaskers(task: Task): Promise<void> {
    try {
      const taskers = await this.taskersService.findAll();
      const district = task.district;

      const taskersInDistrict = taskers.filter((tasker) =>
        tasker.work_area.includes(district),
      );

      taskersInDistrict.forEach((tasker) => {
        if (!tasker.user) {
          return;
        }

        if (tasker.user.id === task.user.id) {
          return;
        }

        console.log('Send email to tasker', tasker.user);
        this.notificationsService.sendToUser({
          user_id: tasker.user.id,
          message: `New task in your district`,
          type: NotificationType.MESSAGE,
          link: `apply/${task.id}`,
        });

        this.emailService.sendTaskEmail(task, tasker);
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   *  * Kiểm tra xem tasker có thể apply task không, nếu có thì thêm tasker vào task
   * @param tasker_id
   * @param user_id
   * @param task_id
   * @returns
   */
  async apply(
    tasker_id: number,
    user_id: number,
    task_id: number,
  ): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id: task_id },
        relations: ['taskers', 'user'],
      });

      // console.log(task);

      // ! Không được apply task của chính mình
      if (task.user.id === user_id) {
        throw new ForbiddenException('You cannot apply for your own task');
      }

      // ! Chỉ được apply task có status là POSTED
      if (task.task_status !== Status.POSTED) {
        throw new BadRequestException('Task is not available for application');
      }

      // ! Kiểm tra xem tasker có tồn tại không
      const tasker = await this.taskersService.findOne(tasker_id).catch(() => {
        throw new NotFoundException('Tasker not found is task service');
      });

      // ! Kiểm tra xem tasker đã apply task chưa
      const isApplied = task.taskers.find((tasker) => tasker.id === tasker_id);
      if (isApplied) {
        throw new BadRequestException(
          'Tasker has already applied for this task',
        );
      }

      this.notificationsService.sendToUser({
        user_id: task.user.id,
        message: `Tasker ${tasker.id} has applied for your task`,
        type: NotificationType.MESSAGE,
        link: `taskmanage`,
      });

      console.log('Send email to user', task.user.email);
      this.emailService.sendApplyTaskEmail(tasker, task, task.user);

      task.taskers.push(tasker);
      return this.taskRepository.save(task);
    } catch (error) {
      throw error;
    }
  }

  // * Tasker hoàn thành công việc
  async complete(tasker_id: number, task_id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id: task_id },
        relations: [
          'taskers',
          'user',
          'user.profile',
          'tasker',
          'tasker.user.profile',
        ],
      });

      const tasker = task.taskers.find((tasker) => tasker.id === tasker_id);

      if (!tasker) {
        throw new NotFoundException('Tasker not found');
      }

      task.task_status = Status.WAITING;

      this.notificationsService.sendToUser({
        user_id: task.user.id,
        message: `Tasker ${tasker.id} has completed the task`,
        type: NotificationType.MESSAGE,
        link: `taskmanage`,
      });

      this.emailService.sendTaskerCompleteTaskEmail(task, tasker);

      return this.taskRepository.save(task);
    } catch (error) {
      throw error;
    }
  }

  // * User chọn một tasker để làm việc
  async choose(
    user_id: number,
    tasker_id: number,
    task_id: number,
  ): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id: task_id },
        relations: ['taskers', 'user', 'user.profile'],
      });

      // ! Đây có phải là task của user không
      if (task.user.id !== user_id) {
        throw new ForbiddenException('You cannot choose tasker for this task');
      }

      // ! Task có status là POSTED mới được chọn
      if (task.task_status !== Status.POSTED) {
        throw new BadRequestException('Task is not available for application');
      }

      // ! Kiểm tra xem tasker có trong danh sách tasker của task không
      const tasker = task.taskers.find((tasker) => tasker.id === tasker_id);
      if (!tasker) {
        throw new BadRequestException('Tasker is not in the tasker list');
      }

      // * UPDATE trạng thái và tasker cho task
      task.task_status = Status.PENDING;
      task.tasker = tasker;

      const taskerData = await this.taskersService.getAllTaskerData(tasker_id);

      // * Gửi thông báo cho tasker
      this.notificationsService.sendToUser({
        user_id: tasker.id,
        message: `You have been chosen for task ${task.id}`,
        type: NotificationType.MESSAGE,
        link: `taskmanage/tasker`,
      });

      this.emailService.chooseTaskerEmail(taskerData, task);

      return this.taskRepository.save(task);
    } catch (error) {
      throw error;
    }
  }

  // * Admin chấp nhận thanh toán gửi thông tin cho user và tasker
  async accept(task_id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id: task_id },
        relations: [
          'tasker',
          'user',
          'user.profile',
          'tasker.user',
          'tasker.user.profile',
          'tasker.skills',
        ],
      });

      if (task.task_status !== Status.PAYMENT_CONFIRM) {
        throw new BadRequestException('Task is not available for payment');
      }

      task.task_status = Status.IN_PROGRESS;

      // * Gửi thông báo cho user
      this.notificationsService.sendToUser({
        user_id: task.user.id,
        message: `Tasker ${task.tasker.id} has accepted the task`,
        type: NotificationType.MESSAGE,
        link: `taskmanage`,
      });

      // * Gửi email cho user và tasker
      console.log('Send email to user', task.user.email);
      this.emailService.sendTaskerAcceptForTaskerEmail(task, task.tasker.user);
      console.log('Send email to tasker', task.tasker.user.email);
      this.emailService.sendTaskerAcceptEmail(task, task.tasker);

      this.taskRepository.save(task);

      return await this.taskRepository.findOne({ where: { id: task_id } });
    } catch (error) {
      throw error;
    }
  }

  // * Gửi thông báo cho admin để xác nhận thanh toán
  async pay(tasker_id: number, task_id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id: task_id },
        relations: [
          'tasker',
          'user',
          'user.profile',
          'tasker.user',
          'tasker.user.profile',
        ],
      });

      if (tasker_id != task.tasker.id) {
        throw new BadRequestException('Tasker is not chosen for this task');
      }

      if (task.task_status !== Status.PENDING) {
        throw new BadRequestException('Task is not available for payment');
      }

      task.task_status = Status.PAYMENT_CONFIRM;

      const admins = await this.usersService.findAllAdmin();

      admins.forEach((admin) => {
        this.notificationsService.sendToUser({
          user_id: task.user.id,
          message: `Tasker ${task.tasker.id} has accepted the task`,
          type: NotificationType.MESSAGE,
          link: `admin/tasks`,
        });
      });

      //SEND EMAIL
      this.emailService.sendAdminConfirmationEmail(task.tasker.user);
      console.log('Send email to admin');

      this.taskRepository.save(task);

      return await this.taskRepository.findOne({ where: { id: task_id } });
    } catch (error) {
      throw error;
    }
  }

  // * User hoàn thành công việc
  async finish(user_id: number, task_id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id: task_id },
        relations: [
          'taskers',
          'user',
          'tasker',
          'tasker.user',
          'tasker.user.profile',
        ],
      });

      if (task.user.id !== user_id) {
        throw new ForbiddenException('You cannot finish this task');
      }

      if (task.task_status !== Status.WAITING) {
        throw new BadRequestException('Task is not available for finishing');
      }

      task.task_status = Status.COMPLETED;

      this.taskersService.updateCompletedTasks(task.tasker.id);

      // * Gửi thông báo cho tasker
      this.notificationsService.sendToUser({
        user_id: task.tasker.id,
        message: `User has finished the task`,
        type: NotificationType.MESSAGE,
        link: `taskmanage/tasker`,
      });

      // * Gửi email cho tasker
      this.emailService.sendTaskerCompleteTaskEmail(task, task.tasker);

      return this.taskRepository.save(task);
    } catch (error) {
      throw error;
    }
  }

  // * Tasker từ chối công việc
  async reject(tasker_id: number, task_id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id: task_id },
        relations: ['taskers', 'tasker', 'user'],
      });

      if (task.task_status === Status.POSTED) {
        const tasker = task.taskers.find((tasker) => tasker.id === tasker_id);
        if (!tasker) {
          throw new NotFoundException('Tasker not found');
        }
        task.taskers = task.taskers.filter((tasker) => tasker.id !== tasker_id);
        task.task_status = Status.POSTED;
      }

      if (
        task.tasker &&
        task.tasker.id === tasker_id &&
        task.task_status === Status.PENDING
      ) {
        task.taskers = task.taskers.filter((tasker) => tasker.id !== tasker_id);
        task.task_status = Status.POSTED;
        task.tasker = null;
      }

      // * Gửi thông báo cho user
      this.notificationsService.sendToUser({
        user_id: task.user.id,
        message: `Tasker ${tasker_id} has rejected the task`,
        type: NotificationType.MESSAGE,
        link: `taskmanage`,
      });

      this.emailService.sendTaskerRejectionEmail(task);

      return this.taskRepository.save(task);
    } catch (error) {
      throw error;
    }
  }

  // * User hủy công việc
  async cancel(user_id: number, task_id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id: task_id },
        relations: ['taskers', 'user'],
      });

      if (task.user.id !== user_id) {
        throw new ForbiddenException('You cannot cancel this task');
      }

      if (task.task_status !== Status.POSTED) {
        throw new BadRequestException('Task is not available for cancelling');
      }

      task.task_status = Status.CANCELLED;

      // * Gửi thông báo cho tasker
      task.taskers.forEach((tasker) => {
        this.notificationsService.sendToUser({
          user_id: tasker.id,
          message: `User has cancelled the task`,
          type: NotificationType.MESSAGE,
          link: `taskmanager/tasker`,
        });
      });

      return this.taskRepository.save(task);
    } catch (error) {
      throw error;
    }
  }
}
