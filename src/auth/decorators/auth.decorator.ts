import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interface/validate-roles';
import { RolesProtected } from './roles-protected/roles-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RolesProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
