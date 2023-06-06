import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class EditUserDto {
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
