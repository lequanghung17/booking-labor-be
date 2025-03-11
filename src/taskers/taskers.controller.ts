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
} from '@nestjs/common';
import { TaskersService } from './taskers.service';
import { CreateTaskerDto } from './dto/create-tasker.dto';
import { UpdateTaskerDto } from './dto/update-tasker.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthRequest } from 'src/auth/interface/auth-request.interface';
import { RolesGuard } from 'src/auth/decorator/role-guard.decorator';
import { Role } from 'src/enum/Role.enum';

@Controller('taskers')
export class TaskersController {
  constructor(private readonly taskersService: TaskersService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Req() req: AuthRequest, @Body() createTaskerDto: CreateTaskerDto) {
    const user_id = req.user.user_id;

    return this.taskersService.create(user_id, createTaskerDto);
  }

  @ApiBearerAuth('JWT-auth')
  @RolesGuard([Role.ADMIN])
  @Get()
  findAll() {
    return this.taskersService.findAll();
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  findOne(@Req() req: AuthRequest, @Param('id') id: string) {
    if (id === 'me') {
      return this.taskersService.findOne(req.user.tasker_id);
    }

    if (req.user.role === Role.ADMIN) {
      return this.taskersService.findOne(+id);
    }

    throw new ForbiddenException('Insufficient permissions');
  }

  @ApiBearerAuth('JWT-auth')
  @Patch()
  update(@Req() req: AuthRequest, @Body() updateTaskerDto: UpdateTaskerDto) {
    return this.taskersService.update(req.user.tasker_id, updateTaskerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskersService.remove(+id);
  }
}
