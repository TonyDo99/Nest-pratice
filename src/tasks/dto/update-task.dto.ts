import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../task-staus.enum';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
