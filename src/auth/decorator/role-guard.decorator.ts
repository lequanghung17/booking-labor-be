import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { RoleGuard } from '../guards/role.guard';
import { Role } from 'src/enum/Role.enum';

export function RolesGuard(roles: Role[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(RoleGuard));
}
