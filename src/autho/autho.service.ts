import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthoService {
  hello() {
    return 'Welcome admin';
  }
}
