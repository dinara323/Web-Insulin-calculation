import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';
export class RegisterUserDto {
  @ApiProperty({ example: 'yakubova_lab4', maxLength: 100 })
  @IsString()
  @Length(3, 100)
  @Matches(/^[a-zA-Zа-яА-ЯёЁ0-9_.-]+$/)
  name!: string;
  @ApiProperty({ example: 'Lab4-password!', minLength: 8, maxLength: 72 })
  @IsString()
  @Length(8, 72)
  password!: string;
}
