import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/enum/Role.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Public } from 'src/auth/decorator/public.decorator';
import { RolesGuard } from 'src/auth/decorator/role-guard.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(+id);
  }

  @ApiBearerAuth('JWT-auth')
  @RolesGuard([Role.ADMIN])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(+id, updateSkillDto);
  }

  @ApiBearerAuth('JWT-auth')
  @RolesGuard([Role.ADMIN])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillsService.remove(+id);
  }
}
