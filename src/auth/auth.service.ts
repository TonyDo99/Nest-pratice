import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../entities/user.entity';
import { hashSync, genSaltSync, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    try {
      const hashPassword = hashSync(password, genSaltSync());

      const users = this.userRepository.create({
        username,
        password: hashPassword,
      });

      await this.userRepository.save(users);

      return users;
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException(`User was exists in database`);
      throw new ForbiddenException();
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    try {
      const user = await this.userRepository.manager.findOne(User, {
        where: { username },
      });

      if (user && (await compare(password, user.password))) {
        const payload: JwtPayload = { username };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
      }
      throw new NotFoundException(`User ${username} does not exist`);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
