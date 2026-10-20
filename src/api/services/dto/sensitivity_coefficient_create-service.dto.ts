import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateServiceDto {
  @ApiProperty({ example: 'Расчёт чувствительности', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  name!: string;
  @ApiProperty({ example: 'Учебный пример', maxLength: 500 })
  @IsString()
  @MaxLength(500)
  description!: string;
  @ApiPropertyOptional({ example: 40 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  age?: number;
  @ApiPropertyOptional({ example: 70 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  weight?: number;
  @ApiPropertyOptional({
    description:
      'Необязательно; при публикации сервер вычисляет по возрасту и весу',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sensitivityCoefficient?: number;
}
export class PublishServiceDto extends PartialType(CreateServiceDto) {}
