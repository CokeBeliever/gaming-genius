import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post(':id')
  editById(@Param('id', ParseIntPipe) id: number, @Body() dto: EditUserDto) {
    return this.userService.editById(id, dto);
  }
}
