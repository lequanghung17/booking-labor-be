import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSchema,
  ApiTags,
} from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/enum/Role.enum';
import { AuthRequest } from 'src/auth/interface/auth-request.interface';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'ADMIN: create new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'ADMIN: Get all user' })
  @ApiResponse({
    status: 200,
    description: 'Return all user.',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'ADMIN: /:id, USER: /me to get current user',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Return the user by ID.',
  })
  findMe(@Req() req: AuthRequest, @Param('id') id: string) {
    if (id === 'me') {
      return this.usersService.findById(req.user.user_id);
    }
    if (req.user.role === Role.ADMIN) {
      return this.usersService.findById(Number(id));
    }
    throw new ForbiddenException(
      "You don't have permission to access this resource",
    );
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', required: true })
  @ApiOperation({
    summary: 'ADMIN: /:id, USER: /me to update current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the user updated by ID.',
  })
  update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (id === 'me') {
      return this.usersService.update(req.user.user_id, updateUserDto);
    }
    // if (req.user.role === Role.ADMIN) {
    //   return this.usersService.update(+id, updateUserDto);
    // }
    throw new ForbiddenException(
      "You don't have permission to access this resource",
    );
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'ADMIN: /:id, USER: /me delete current user' })
  @ApiResponse({
    status: 200,
    description: 'Return the user deleted by ID.',
  })
  remove(@Req() req: AuthRequest, @Param('id') id: string) {
    if (id === 'me') {
      return this.usersService.remove(req.user.user_id);
    }
    if (req.user.role === Role.ADMIN) {
      return this.usersService.remove(+id);
    }
    throw new ForbiddenException(
      "You don't have permission to access this resource",
    );
  }
}
