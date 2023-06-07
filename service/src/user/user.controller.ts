import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  editById(@Param('id', ParseIntPipe) id: number, @Body() dto: EditUserDto) {
    return this.userService.editById(id, dto);
  }
}
