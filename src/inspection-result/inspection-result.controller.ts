import { Controller, Get, Post, Body } from '@nestjs/common';
import { InspectionResultService } from './inspection-result.service';
import { CreateInspectionResultDto } from './dto/create-inspection-result.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interface/validate-roles';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('inspection-result')
export class InspectionResultController {
  constructor(
    private readonly inspectionResultService: InspectionResultService,
  ) {}

  @Post()
  @Auth(ValidRoles.OPERATOR)
  create(
    @Body() createInspectionResultDto: CreateInspectionResultDto,
    @GetUser() user: User,
  ) {
    console.log('controller');
    return this.inspectionResultService.create(
      createInspectionResultDto,
      user.id,
    );
  }

  // @Get()
  // findAll() {
  //   return this.inspectionResultService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.inspectionResultService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateInspectionResultDto: UpdateInspectionResultDto) {
  //   return this.inspectionResultService.update(+id, updateInspectionResultDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.inspectionResultService.remove(+id);
  // }
}
