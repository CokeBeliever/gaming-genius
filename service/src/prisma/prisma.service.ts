import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  clearDb() {
    return this.$transaction([this.user.deleteMany()]);
  }
}
