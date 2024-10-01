import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { ClassValidationPipe } from 'src/common/pipes/class-validation.pipe';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { UserDocument } from './schemas/user.schema';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { IReqUserInfo } from 'src/auth/interfaces/req-user-Info.interface';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';

import { UserAddDto } from './dto/userAdd.dto';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@UseInterceptors(new SanitizeMongooseModelInterceptor())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ClassValidationPipe)
  async userMe(@GetUser() reqUser: IReqUserInfo): Promise<UserDocument> {
    return await this.userService.userMe(reqUser);
  }

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
