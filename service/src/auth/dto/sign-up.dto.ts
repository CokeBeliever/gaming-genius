import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsPhoneNumber('CN')
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  nickname?: string;
}
