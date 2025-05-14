// apps/api/src/farms/farms.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { FarmsService } from './farms.service';
  
  @Controller('farms')
  @UseGuards(JwtAuthGuard)
  export class FarmsController {
    constructor(private readonly farmsService: FarmsService) {}
  
    @Post()
    create(@Request() req, @Body() createFarmDto: any) {
      return this.farmsService.create(req.user.sub, createFarmDto);
    }
  
    @Get()
    findAll(@Request() req) {
      return this.farmsService.findAll(req.user.sub);
    }
  
    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
      return this.farmsService.findOne(req.user.sub, id);
    }
  
    @Patch(':id')
    update(
      @Request() req,
      @Param('id') id: string,
      @Body() updateFarmDto: any,
    ) {
      return this.farmsService.update(req.user.sub, id, updateFarmDto);
    }
  
    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
      return this.farmsService.remove(req.user.sub, id);
    }
  }