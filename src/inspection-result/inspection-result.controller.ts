import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InspectionResultService } from './inspection-result.service';
import { CreateInspectionResultDto } from './dto/create-inspection-result.dto';
import { UpdateInspectionResultDto } from './dto/update-inspection-result.dto';

@Controller('inspection-result')
export class InspectionResultController {
  constructor(private readonly inspectionResultService: InspectionResultService) {}

  @Post()
  create(@Body() createInspectionResultDto: CreateInspectionResultDto) {
    return this.inspectionResultService.create(createInspectionResultDto);
  }

  @Get()
  findAll() {
    return this.inspectionResultService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inspectionResultService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInspectionResultDto: UpdateInspectionResultDto) {
    return this.inspectionResultService.update(+id, updateInspectionResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inspectionResultService.remove(+id);
  }
}
