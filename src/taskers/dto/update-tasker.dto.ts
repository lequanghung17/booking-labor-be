import { PartialType } from '@nestjs/swagger';
import { CreateTaskerDto } from './create-tasker.dto';

export class UpdateTaskerDto extends PartialType(CreateTaskerDto) {}
