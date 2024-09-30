import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserSessionDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @IsDate()
  createdAt!: Date;
}
