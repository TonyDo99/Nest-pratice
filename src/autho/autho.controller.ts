import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthoService } from './autho.service';
import { Roles } from './role.decorator';
import { Role } from './role.enum';
import { RolesGuard } from './roles.guard';

@Controller('autho')
@UseGuards(RolesGuard)
export class AuthoController {
  constructor(private authoService: AuthoService) {}
  @Get('')
  @Roles(Role.User)
  hello() {
    return this.authoService.hello();
  }
}
