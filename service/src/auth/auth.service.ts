import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { SignInDto, SignUpDto } from './dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async signUp(dto: SignUpDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.userService.create({
        ...dto,
        password: hash,
      });

      delete user.password;

      return {
        user,
        token: await this.signToken(user.id, user.email),
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('用户已注册');
      }
      throw error;
    }
  }

  async signIn(dto: SignInDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user) {
      throw new ForbiddenException('凭证不正确');
    } else {
      const pwMatches = await argon.verify(user.password, dto.password);
      if (!pwMatches) {
        throw new ForbiddenException('凭证不正确');
      } else {
        delete user.password;

        return {
          user,
          token: await this.signToken(user.id, user.email),
        };
      }
    }
  }

  async signToken(id: number, email: string) {
    const payload = {
      sub: id,
      email,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1h',
    });

    return `Bearer ${token}`;
  }
}
