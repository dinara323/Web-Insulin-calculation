import {
  ApiTags,
  ApiOperation,
  ApiCookieAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SessionGuard } from '../../auth/sensitivity_coefficient_session.guard';
import {
  UseGuards,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ServicesService } from './sensitivity_coefficient_services.service';
import {
  CreateServiceDto,
  PublishServiceDto,
} from './dto/sensitivity_coefficient_create-service.dto';
import { ServiceFilterDto } from './dto/sensitivity_coefficient_service-filter.dto';
import { UploadedFile } from '../../common/sensitivity_coefficient_uploaded-file';

@ApiTags('Расчёты')
@Controller('api/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Список опубликованных расчётов, доступен гостю' })
  getServices(
    @Query() filter: ServiceFilterDto,
  ): Promise<Record<string, any>[]> {
    return this.servicesService.getServices(filter);
  }

  @Get('feed')
  @ApiOperation({ summary: 'Лента: первая, выбранная или следующая карточка' })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'next', required: false, type: Boolean })
  getFeed(
    @Query('id') id?: string,
    @Query('next') next?: string,
  ): Promise<Record<string, any>> {
    return this.servicesService.getFeed(id, next);
  }

  @Get('draft')
  @ApiOperation({ summary: 'Черновик текущего создателя' })
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  @ApiUnauthorizedResponse({ description: 'Нет активной сессии' })
  getDraft(): Promise<Record<string, any> | null> {
    return this.servicesService.getDraft();
  }

  @Post()
  @ApiOperation({ summary: 'Создать черновик с фото и видео' })
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  @ApiUnauthorizedResponse({ description: 'Нет активной сессии' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'description'],
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        age: { type: 'integer' },
        weight: { type: 'integer' },
        image: { type: 'string', format: 'binary' },
        video: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  create(
    @Body() dto: CreateServiceDto,
    @UploadedFiles()
    files: {
      image?: UploadedFile[];
      video?: UploadedFile[];
    },
  ): Promise<Record<string, any>> {
    return this.servicesService.create(
      dto,
      files?.image?.[0],
      files?.video?.[0],
    );
  }

  @Put(':id/publish')
  @ApiOperation({ summary: 'Заполнить и опубликовать свой черновик' })
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  @ApiUnauthorizedResponse({ description: 'Нет активной сессии' })
  publish(
    @Param('id') id: string,
    @Body() dto: PublishServiceDto,
  ): Promise<Record<string, any>> {
    return this.servicesService.publish(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить свой расчёт' })
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  @ApiUnauthorizedResponse({ description: 'Нет активной сессии' })
  delete(@Param('id') id: string): Promise<Record<string, any>> {
    return this.servicesService.delete(id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Поставить или отменить лайк' })
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  @ApiUnauthorizedResponse({ description: 'Нет активной сессии' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['value'],
      properties: { value: { type: 'integer', enum: [0, 1] } },
    },
  })
  setLike(
    @Param('id') id: string,
    @Body('value') value: number,
  ): Promise<{ serviceId: number; liked: boolean }> {
    return this.servicesService.setLike(id, Number(value));
  }
}
