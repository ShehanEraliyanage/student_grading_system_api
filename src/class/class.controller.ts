import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseInterceptors,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';

import { ClassService } from './class.service';

import { ClassValidationPipe } from '../common/pipes/class-validation.pipe';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';

import { ClassAddDto } from './dto/classAdd.dto';

@ApiTags('class')
@Controller('class')
@ApiBearerAuth()
@UseInterceptors(new SanitizeMongooseModelInterceptor())
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('/create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ClassValidationPipe)
  async create(@Body() classAddingDto: ClassAddDto) {
    return this.classService.create(classAddingDto);
  }

  @Get('/all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ClassValidationPipe)
  async findAll() {
    return this.classService.findAllClasses();
  }
}
