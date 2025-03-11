import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ForbiddenException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthRequest } from 'src/auth/interface/auth-request.interface';
import { Public } from 'src/auth/decorator/public.decorator';
import { TaskActionService } from './task-action.service';
import { RolesGuard } from 'src/auth/decorator/role-guard.decorator';
import { Role } from 'src/enum/Role.enum';

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly taskActionService: TaskActionService,
  ) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'User create a task' })
  @Post()
  create(@Req() req: AuthRequest, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user.user_id, createTaskDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'ADMIN: Get all tasks' })
  @RolesGuard([Role.ADMIN])
  @Get('admin')
  findAllForAdmin() {
    return this.tasksService.findAllForAdmin();
  }

  @ApiQuery({ name: 'id', required: false })
  @ApiOperation({ summary: 'Get a task by id' })
  @Public()
  @Get()
  findOne(@Query('id') id: string) {
    if (!id || isNaN(Number(id))) {
      return this.tasksService.findAllForUser();
    }
    return this.tasksService.findOne(+id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all tasks created by user' })
  @Get('user')
  findUserTasks(@Req() req: AuthRequest) {
    return this.tasksService.findUserTasks(req.user.user_id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all tasks assigned to tasker' })
  @Get('tasker')
  findTaskerTasks(@Req() req: AuthRequest) {
    if (!req.user.tasker_id) {
      throw new ForbiddenException('You must be a tasker to view tasks');
    }

    return this.tasksService.findTaskerTasks(req.user.tasker_id);
  }

  // ! POST -> APPLY -> CHOOSE -> ACCEPT -> WAIT -> COMPLETE -> RATE
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tasker apply for a task' })
  @Patch(':id/apply')
  apply(@Req() req: AuthRequest, @Param('id') id: string) {
    if (!req.user.tasker_id) {
      throw new ForbiddenException('You must be a tasker to apply for a task');
    }

    return this.taskActionService.apply(
      req.user.tasker_id,
      req.user.user_id,
      +id,
    );
  }

  // CHOOSE
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'User choose a tasker for a task' })
  @Patch(':task_id/choose/:tasker_id')
  choose(
    @Req() req: AuthRequest,
    @Param('task_id') task_id: string,
    @Param('tasker_id') tasker_id: string,
  ) {
    return this.taskActionService.choose(
      req.user.user_id,
      +tasker_id,
      +task_id,
    );
  }

  // TASKER PAY
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tasker accept a task' })
  @Patch(':id/pay')
  accept(@Req() req: AuthRequest, @Param('id') id: string) {
    if (!req.user.tasker_id) {
      throw new ForbiddenException('You must be a tasker to accept a task');
    }

    return this.taskActionService.pay(req.user.tasker_id, +id);
  }

  //ADMIN ACCEPT
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'ADMIN: Tasker accept a task' })
  @RolesGuard([Role.ADMIN])
  @Patch(':id/accept')
  adminAccept(@Param('id') id: string) {
    return this.taskActionService.accept(+id);
  }

  // WAIT
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tasker complete a task' })
  @Patch(':id/complete')
  complete(@Req() req: AuthRequest, @Param('id') id: string) {
    if (!req.user.tasker_id) {
      throw new ForbiddenException('You must be a tasker to complete a task');
    }

    return this.taskActionService.complete(req.user.tasker_id, +id);
  }

  // COMPLETE
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'User rate a tasker' })
  @Patch(':id/finish')
  finish(@Req() req: AuthRequest, @Param('id') task_id: string) {
    return this.taskActionService.finish(req.user.user_id, +task_id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tasker reject a task' })
  @Patch(':id/reject')
  reject(@Req() req: AuthRequest, @Param('id') id: string) {
    if (!req.user.tasker_id) {
      throw new ForbiddenException('You must be a tasker to reject a task');
    }

    return this.taskActionService.reject(req.user.tasker_id, +id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'User rate a tasker' })
  @Patch(':id/cancel')
  cancel(@Req() req: AuthRequest, @Param('id') task_id: string) {
    return this.taskActionService.cancel(req.user.user_id, +task_id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
  //   return this.tasksService.update(+id, updateTaskDto);
  // }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'User cancel a task' })
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.tasksService.remove(req.user.user_id, +id);
  }
}
