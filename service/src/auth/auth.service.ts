import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signUp(dto: SignUpDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          ...dto,
          password: hash,
        },
      });
      return user;
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

  signIn(dto: SignInDto) {}
}
