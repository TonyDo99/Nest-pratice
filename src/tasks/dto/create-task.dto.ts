import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from '../task-staus.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(TaskStatus)
  @IsString()
  status: TaskStatus;
}
