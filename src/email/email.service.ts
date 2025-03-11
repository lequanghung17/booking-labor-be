import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { welcomeEmailTemplate } from './templates/email.templates';
import { confirmEmailTemplate } from './templates/confirm.templates';
import { User } from 'src/users/entities/user.entity';
import { url } from 'inspector';
import { taskerRegistrationTemplate } from './templates/apply.templates';
import { Tasker } from 'src/taskers/entities/tasker.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { taskerConfirmationTemplate } from './templates/chooseTasker.template';
import { taskForTasker } from './templates/taskfortasker.templates';
import { taskerDeclineTask } from './templates/taskerdecline.templates';
import { taskerAcceptTask } from './templates/taskeraccept.templates';
import { sendUserProfileForTasker } from './templates/taskeraccept_fortasker.templates';
import { taskerCompleteTask } from './templates/taskercompletetask.templates';
import { userConfirmCompleted } from './templates/userconfirmcompleted.templates';
import { userReviewTasker } from './templates/userreviewtasker.templates';
import { otpEmailTemplate } from './templates/otp.templates';

@Injectable()
export default class EmailService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }

  /**
   * Chào mừng người dùng
   */
  sendWelcomeEmail(email: string) {
    return this.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'Welcome to our platform 🎉',
      html: welcomeEmailTemplate('Hoàng Xuân Trường'),
    });
  }

  /**
   * Gửi OTP cho người dùng
   */
  sendOTP(email: string, otp: string) {
    return this.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'OTP Verification',
      html: otpEmailTemplate(otp, email),
    });
  }

  /**
   * * Gửi email xác nhận thanh toán cho admin
   */
  sendAdminConfirmationEmail(user: User) {
    const email = this.configService.get('ADMIN_EMAIL');
    const url = this.configService.get('APP_URL');

    return this.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'Xác nhận thanh toán',
      html: confirmEmailTemplate(url, user),
    });
  }

  /**
   * * Thông báo người dùng khi có tasker đăng ký công việc
   */
  sendApplyTaskEmail(tasker: Tasker, task: Task, user: User) {
    const url = `${this.configService.get('APP_URL')}/taskmanage`;
    return this.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: user.email,
      subject: 'Thông báo đăng ký công việc',
      html: taskerRegistrationTemplate(url, tasker, task),
    });
  }

  /**
   * * Thông báo tasker khi được chọn
   */
  chooseTaskerEmail(tasker: Tasker, task: Task) {
    const acceptUrl = `${this.configService.get('APP_URL')}/tasks/${task.id}/pay`;
    const rejectUrl = `${this.configService.get('APP_URL')}/tasks/${task.id}/reject`;
    return this.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: tasker.user.email,
      subject: 'Chúc mừng bạn đã được chọn',
      html: taskerConfirmationTemplate(acceptUrl, rejectUrl, task, tasker),
    });
  }

  /**
   * * Gửi email thông báo công việc cho tất cả tasker khu vực
   */
  sendTaskEmail(task: Task, tasker: Tasker) {
    const url = `${this.configService.get('APP_URL')}/tasks/${task.id}`;
    const applyUrl = `${this.configService.get('APP_URL')}/tasks/${task.id}/apply`;
    return this.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: tasker.user.email,
      subject: 'Công việc mới',
      html: taskForTasker(task, url, applyUrl),
    });
  }

  /**
   * * Gửi email thông báo tasker từ chối công việc
   */
  sendTaskerRejectionEmail(task: Task) {
    return this.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: task.user.email,
      subject: 'Tasker đã từ chối công việc',
      html: taskerDeclineTask(task),
    });
  }

  /**
   * * Gửi email cho user thông báo tasker chấp nhận công việc
   */
  sendTaskerAcceptEmail(task: Task, tasker: Tasker) {
    const viewTaskDetailsUrl = `${this.configService.get('APP_URL')}/tasks/${task.id}`;
    return this.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: task.user.email,
      subject: 'Tasker đã chấp nhận công việc',
      html: taskerAcceptTask(task, tasker, viewTaskDetailsUrl),
    });
  }

  /**
   * * Gửi email thông tin user cho tasker
   */
  sendTaskerAcceptForTaskerEmail(task: Task, user: User) {
    const viewTaskDetailsUrl = `${this.configService.get('APP_URL')}/tasks/${task.id}`;
    return this.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: user.email,
      subject: 'Thông tin công việc',
      html: sendUserProfileForTasker(task, user, viewTaskDetailsUrl),
    });
  }

  /**
   * * Gửi email thông báo tasker đã hoàn thành công việc
   */
  sendTaskerCompleteTaskEmail(task: Task, tasker: Tasker) {
    const viewTaskDetailsUrl = `${this.configService.get('APP_URL')}/tasks/${task.id}`;
    return this.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: task.user.email,
      subject: 'Tasker đã hoàn thành công việc',
      html: taskerCompleteTask(task, tasker, viewTaskDetailsUrl),
    });
  }

  /**
   * * Gửi email cho tasker thông báo user đã xác nhận công việc hoàn thành
   */
  sendUserConfirmCompleted(user: User, task: Task, tasker: Tasker) {
    return this.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: tasker.user.email,
      subject: 'User đã xác nhận công việc hoàn thành',
      html: userConfirmCompleted(user, task),
    });
  }

  /**
   * Gửi email cho tasker thông báo user đã review công việc
   */
  sendUserTaskerReviewTask(user: User, task: Task, tasker: Tasker) {
    const platformUrl = this.configService.get('APP_URL');
    return this.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: tasker.user.email,
      subject: 'User đã review công việc',
      html: userReviewTasker(user, task, platformUrl),
    });
  }
}
