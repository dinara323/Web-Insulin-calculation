
import {
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
import { CreateServiceDto } from './dto/sensitivity_coefficient_create-service.dto';
import { ServiceFilterDto } from './dto/sensitivity_coefficient_service-filter.dto';
import { UploadedFile } from '../../common/sensitivity_coefficient_uploaded-file';

@Controller('api/services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
  ) {}

  @Get()
  getServices(
    @Query() filter: ServiceFilterDto,
  ): Promise<Record<string, any>[]> {
    return this.servicesService.getServices(filter);
  }

  @Get('feed')
  getFeed(
    @Query('id') id?: string,
    @Query('next') next?: string,
  ): Promise<Record<string, any>> {
    return this.servicesService.getFeed(id, next);
  }

  @Get('draft')
  getDraft(): Promise<Record<string, any> | null> {
    return this.servicesService.getDraft();
  }

  @Post()
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
  publish(
    @Param('id') id: string,
  ): Promise<Record<string, any>> {
    return this.servicesService.publish(id);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
  ): Promise<Record<string, any>> {
    return this.servicesService.delete(id);
  }

  @Post(':id/like')
  setLike(
    @Param('id') id: string,
    @Body('value') value: number,
  ): Promise<{ serviceId: number; liked: boolean }> {
    return this.servicesService.setLike(id, Number(value));
  }
}
