import { Module } from '@nestjs/common';
import { AuthoService } from './autho.service';
import { AuthoController } from './autho.controller';

@Module({
  controllers: [AuthoController],
  providers: [AuthoService],
})
export class AuthoModule {}
