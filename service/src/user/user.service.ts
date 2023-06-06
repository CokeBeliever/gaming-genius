import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  create(dto: CreateUserDto) {
    return this.prismaService.user.create({
      data: dto,
    });
  }

  getByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  editById(id: number, dto: EditUserDto) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: dto,
    });
  }
}
