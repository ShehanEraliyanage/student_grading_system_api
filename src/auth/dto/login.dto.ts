import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  id!: string;

  @ApiProperty()
  response: any;

  @ApiProperty()
  req: any;
}
