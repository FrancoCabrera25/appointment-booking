import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { getModelToken } from '@nestjs/mongoose';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

// Mock del modelo de Mongoose
const mockVehicleModel = {
  create: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findByPatentAndUserId: jest.fn(),
};

const mockVeicleCreateResult: any = {
  patent: 'LJK059',
};

const mockVeicleCreateResultArray: any = [
  {
    patent: 'LJK059',
  },
];

describe('VehicleService', () => {
  let service: VehicleService;
  let model: Model<any>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: getModelToken(Vehicle.name),
          useValue: mockVehicleModel,
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    model = module.get<Model<any>>(getModelToken('Vehicle'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createVehicleDto: CreateVehicleDto = {
      patent: 'LJK059',
    };
    const userId = '2548224457421452';
    it('should create a vehicle', async () => {
      const vehicleCreateSpy = jest
        .spyOn(service, 'create')
        .mockImplementation(async () => {
          return Promise.resolve(mockVeicleCreateResult);
        });

      const result = await service.create(createVehicleDto, userId);

      expect(vehicleCreateSpy).toHaveBeenCalled();
      expect(result).toEqual({
        patent: 'LJK059',
      });
    });

    it('should throw BadRequestException on error', async () => {
      const error = new BadRequestException('No se pudo crear el vehiculo');
      const vehicleCreateSpy = jest
        .spyOn(model, 'create')
        .mockRejectedValue(error);
      await expect(
        service.create(createVehicleDto, userId),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findByPatentAndUserId', () => {
    it('should find a vehicle by patent and userId', async () => {
      const patent = 'LJK059';
      const userId = '145825825';

      const vehicleCreateSpy = jest
        .spyOn(service, 'findByPatentAndUserId')
        .mockImplementation(async () => {
          return Promise.resolve(mockVeicleCreateResult);
        });

      const result = await service.findByPatentAndUserId(patent, userId);

      expect(vehicleCreateSpy).toHaveBeenCalledWith(patent, userId);
      expect(result).toEqual({
        patent: 'LJK059',
      });
    });
  });

  describe('findAllVehicleByUserId', () => {
    it('should find all vehicles by userId', async () => {
      const userId = 'someUserId';

      const vehicleCreateSpy = jest
        .spyOn(service, 'findAllVehicleByUserId')
        .mockImplementation(async () => {
          return Promise.resolve(mockVeicleCreateResultArray);
        });

      const result = await service.findAllVehicleByUserId(userId);

      expect(vehicleCreateSpy).toHaveBeenCalledWith(userId);
      expect(result).toEqual([
        {
          patent: 'LJK059',
        },
      ]);
    });
  });
});
