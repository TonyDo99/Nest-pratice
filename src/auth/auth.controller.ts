import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../entities/user.entity';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  createUser(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Get('/signin')
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    if (await this.authService.signIn(authCredentialsDto))
      response.cookie(
        'cookie-jwt',
        `${this.authService.signIn(authCredentialsDto)}`,
      );
    return this.authService.signIn(authCredentialsDto);
  }
}
