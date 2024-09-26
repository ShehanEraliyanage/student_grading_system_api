import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { ClassValidationPipe } from 'src/common/pipes/class-validation.pipe';

import { UserAddDto } from './dto/userAdd.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(ClassValidationPipe)
  async create(@Body() userAddingDto: UserAddDto) {
    return this.userService.create(userAddingDto);
  }

  // Endpoint to get all users
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  // Endpoint to get a user by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  // Endpoint to delete a user by ID
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
