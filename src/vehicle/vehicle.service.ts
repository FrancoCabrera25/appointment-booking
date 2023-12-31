import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle } from './entities/vehicle.entity';
import { Model } from 'mongoose';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private readonly vehicleModel: Model<Vehicle>,
  ) {}
  async create(createVehicleDto: CreateVehicleDto, userId: string) {
    try {
      const vehicle = await this.vehicleModel.create({
        ...createVehicleDto,
        userId,
      });

      return vehicle;
    } catch (error: any) {
      throw new BadRequestException('No se pudo crear el vehiculo');
    }
  }

  async findByPatentAndUserId(
    patent: string,
    userId: string,
  ): Promise<Vehicle> {
    return await this.vehicleModel.findOne({ patent, userId });
  }

  async findAllVehicleByUserId(userId: string): Promise<Vehicle[]> {
    return await this.vehicleModel.find({ userId });
  }
  // findAll() {
  //   return `This action returns all vehicle`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} vehicle`;
  // }

  // update(id: number, updateVehicleDto: UpdateVehicleDto) {
  //   return `This action updates a #${id} vehicle`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} vehicle`;
  // }
}
