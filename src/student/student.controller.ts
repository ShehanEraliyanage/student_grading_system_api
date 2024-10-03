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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';

import { StudentService } from './student.service';

import { ClassValidationPipe } from '../common/pipes/class-validation.pipe';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { IReqUserInfo } from '../auth/interfaces/req-user-info.interface';
@Controller('student')
export class StudentController {}
