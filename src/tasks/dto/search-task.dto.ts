import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-staus.enum';

export class SearchTaskDto {
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  search?: string;
}
