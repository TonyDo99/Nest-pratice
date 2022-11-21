import { Controller, Get } from '@nestjs/common';
import { AwsService } from './aws.service';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}
  @Get('readcsv')
  getFile() {
    return this.awsService.getFile();
  }
}
