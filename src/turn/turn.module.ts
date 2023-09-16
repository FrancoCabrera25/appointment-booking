import { Module } from '@nestjs/common';
import { TurnService } from './turn.service';
import { TurnController } from './turn.controller';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Turn, Turnschema } from './entities/turn.entity';
import { VehicleModule } from '../vehicle/vehicle.module';

@Module({
  controllers: [TurnController],
  providers: [TurnService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Turn.name,
        schema: Turnschema,
      },
    ]),
    AuthModule,
    VehicleModule,
  ],
  exports: [MongooseModule, TurnService],
})
export class TurnModule {}
