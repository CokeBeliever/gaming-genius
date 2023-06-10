import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from 'src/auth/dto';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './utils/constants';
import { EditUserDto } from 'src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let httpServer: any;
  let admin: any;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    const prismaService: PrismaService = app.get(PrismaService);
    await prismaService.clearDb();

    httpServer = app.getHttpServer();

    const signUpDto: SignUpDto = {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    };
    await request(httpServer)
      .post('/auth/sign-up')
      .send(signUpDto)
      .expect(201)
      .expect(({ body }) => {
        expect(body.user).toBeDefined();
        expect(body.token).toBeDefined();
        admin = body.user;
        token = body.token;
      });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth Controller', () => {
    const signUpDto: SignUpDto = {
      email: 'cokebeliever@163.com',
      password: 'helloworld',
    };

    describe('signUp', () => {
      it('应该注册成功', () => {
        return request(httpServer)
          .post('/auth/sign-up')
          .send(signUpDto)
          .expect(201)
          .expect(({ body }) => {
            expect(body.user).toBeDefined();
            expect(body.token).toBeDefined();
          });
      });

      it('应该注册失败，用户已注册', () => {
        return request(httpServer)
          .post('/auth/sign-up')
          .send(signUpDto)
          .expect(403);
      });
    });

    describe('signIn', () => {
      it('应该登陆成功', () => {
        return request(httpServer)
          .post('/auth/sign-in')
          .send(signUpDto)
          .expect(200)
          .expect(({ body }) => {
            expect(body.user).toBeDefined();
            expect(body.token).toBeDefined();
          });
      });

      it('应该登陆失败，凭证不正确', () => {
        const unRegisteredUser: SignUpDto = {
          email: 'foo@163.com',
          password: '123456',
        };

        return request(httpServer)
          .post('/auth/sign-in')
          .send(unRegisteredUser)
          .expect(403);
      });
    });
  });

  describe('User Controller', () => {
    describe('editById', () => {
      const dto: EditUserDto = {
        username: 'admin',
        phone: '18012345678',
      };
      it('应该修改成功', () => {
        return request(httpServer)
          .put(`/user/${admin.id}`)
          .set('authorization', token)
          .send(dto)
          .expect(200)
          .expect(({ body }) => {
            expect(body).toBeDefined();
            expect(body.username).toBe(dto.username);
            expect(body.phone).toBe(dto.phone);
          });
      });
    });
  });
});
