import {
  Controller,
  Post,
  UseGuards,
  // Body,
  // UsePipes,
  Req,
  // Get,
  // Delete,
  // Res,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.auth.guard';
// import { IReqUserInfo } from './interfaces/req-user-Info.interface';
// import { LoginDto } from './dto/login.dto';
// import { ClassValidationPipe } from 'src/common/pipes/class-validation.pipe';
// import { JwtAuthGuard } from './jwt-auth.guard';
// import { ClassValidationNoWhiteListedPipe } from 'src/common/pipes/class-validation-no-whitelisted.pipe';
import { UserService } from 'src/user/user.service';
import { ApiTags } from '@nestjs/swagger'; //ApiBearerAuth, ApiCreatedResponse,
// import { GetUser } from 'src/common/decorators/get-user.decorator';
// import { ILocalLoginReturn } from './interfaces/local-login-return.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UserService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }
}
