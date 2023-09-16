import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './entities/vehicle.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Vehicle.name,
        schema: VehicleSchema,
      },
    ]),
    AuthModule,
  ],
  exports: [MongooseModule, VehicleService],
})
export class VehicleModule {}
