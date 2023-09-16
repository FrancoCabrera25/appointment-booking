import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TurnService } from './turn.service';
import { CreateTurnDto } from './dto/create-turn.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ValidRoles } from '../auth/interface/validate-roles';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('turn')
export class TurnController {
  constructor(private readonly turnService: TurnService) {}

  @Post()
  @Auth(ValidRoles.CLIENT)
  create(@Body() createTurnDto: CreateTurnDto, @GetUser() user: User) {
    return this.turnService.create(createTurnDto, user.id);
  }

  @Get('availableTurn/:date')
  @Auth(ValidRoles.CLIENT)
  availableTurn(@Param('date') date: string) {
    return this.turnService.findAvailableTurnByDay(date);
  }

  @Get('getAllByDate/:date')
  @Auth(ValidRoles.OPERATOR)
  findAllTurnByDate(@Param('date') date: string) {
    return this.turnService.findAllTurnByDate(date);
  }

  @Get('getByUser')
  @Auth(ValidRoles.CLIENT)
  findAllTurnByUserId(@GetUser() user: User) {
    return this.turnService.findAllTurnByUserId(user.id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.turnService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTurnDto: UpdateTurnDto) {
  //   return this.turnService.update(+id, updateTurnDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.turnService.remove(+id);
  // }
}
