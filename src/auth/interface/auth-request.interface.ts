import { Request } from 'express';
import { Role } from 'src/enum/Role.enum';

export interface AuthRequest extends Request {
  user: {
    user_id: number;
    tasker_id: number;
    profile_id: number;
    role: Role;
  };
}
