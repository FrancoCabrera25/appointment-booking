import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTurnDto } from './dto/create-turn.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Turn } from './entities/turn.entity';
import { Model } from 'mongoose';
import { VehicleService } from '../vehicle/vehicle.service';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { getHourAvailableForDay } from './utils/generateAvailableTurns';

@Injectable()
export class TurnService {
  constructor(
    @InjectModel(Turn.name) private readonly turnModel: Model<Turn>,
    private readonly vehicleService: VehicleService,
  ) {}
  async create(createTurnDto: CreateTurnDto, userId: string) {
    const { patent, date, hour } = createTurnDto;
    const newTurn = {
      date: new Date(date),
      hour,
      vehicleId: null,
    };

    //validar que no existe un turno para ese dia y horario
    const isExistTurn = await this.checkIfTurnExists(date, hour);
    if (isExistTurn) {
      console.log('isExistTurn', isExistTurn);
      throw new BadRequestException(
        'Existe un turno registrado para ese dia y horario',
      );
    }
    //validar que esa patente exista para el usuario sino la crea y validad que no tenga un turno existente para ese vehiculo
    const newVehicle = await this.getVehicleOrThrowIfTurnExists(patent, userId);
    newTurn.vehicleId = newVehicle._id.toString();
    try {
      return await this.turnModel.create(newTurn);
    } catch (error: any) {}
  }

  async checkIfTurnExists(date: string, hour: string): Promise<boolean> {
    const existingTurn = await this.findOneTurnByDateAndHour(
      new Date(date),
      hour,
    );
    return !!existingTurn;
  }

  async getVehicleOrThrowIfTurnExists(
    patent: string,
    userId: string,
  ): Promise<Vehicle> {
    const existingVehicle = await this.vehicleService.findByPatentAndUserId(
      patent,
      userId,
    );

    // Verificar si ya existe un turno pendiente para el vehículo
    const existingPendingTurn =
      await this.findOneTurnUserIdAndVehicleIdAndStatus(
        existingVehicle._id.toString(),
        'PENDING',
      );

    if (existingPendingTurn) {
      throw new BadRequestException(
        'El vehículo ya tiene un turno registrado y pendiente. Debe completar o cancelar el turno para registrar otro.',
      );
    }

    if (existingVehicle) {
      return existingVehicle;
    }

    return this.vehicleService.create({ patent }, userId);
  }

  async findOneTurnUserIdAndVehicleIdAndStatus(
    vehicleId: string,
    status: string,
  ) {
    try {
      return await this.turnModel.findOne({ vehicleId, status });
    } catch (error) {
      throw new InternalServerErrorException('Erro interno en el servidor');
    }
  }

  async findOneTurnByDateAndHour(date: Date, hour: string) {
    return await this.turnModel.findOne({
      date,
      hour,
      status: { $in: ['PENDING', 'CONFIRM', 'RESERVED', 'FINISHED'] },
    });
  }

  async findAvailableTurnByDay(date: string) {
    const reservedTurn = await this.findTurnByDate(new Date(date));
    const availlableTurn = getHourAvailableForDay(reservedTurn);
    return availlableTurn;
  }

  async findTurnByDate(date: Date) {
    return await this.turnModel.find({
      date,
      status: { $in: ['PENDING', 'CONFIRM', 'RESERVED', 'FINISHED'] },
    });
  }

  async findAllTurnByDate(date: string) {
    const dateParsed = new Date(date);
    return await this.turnModel.find({
      dateParsed,
    });
  }
  async findAllTurnByUserId(userId: string) {
    const vehicles: Vehicle[] =
      await this.vehicleService.findAllVehicleByUserId(userId);

    if (vehicles.length === 0) return [];

    const vehicleIds = vehicles.map((vehicle) => vehicle._id);

    return await this.turnModel
      .find({ vehicleId: { $in: vehicleIds } }, { __v: 0 })
      .sort({ date: -1 })
      .populate({
        path: 'vehicleId',
        select: '_id, patent',
      });
  }

  async updateTurnStatus(turnId: string, newStatus: string, session?: any) {
    // Realiza la actualización del estado del turno aquí
    const updatedTurn = await this.turnModel.findByIdAndUpdate(
      turnId,
      { status: newStatus },
      { new: true },
    );

    return updatedTurn;
  }
}
