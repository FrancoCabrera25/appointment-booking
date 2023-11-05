import { Test, TestingModule } from '@nestjs/testing';
import { TurnService } from './turn.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { Turn } from './entities/turn.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('TurnService', () => {
  let service: TurnService;
  let vehicleService: VehicleService;
  let model: Model<any>;

  const vehicleMockService = {
    findByPatentAndUserId: jest.fn(),
    create: jest.fn(),
    findAllVehicleByUserId: jest.fn(),
  };

  const availableTurns = {
    getHourAvailableForDay: jest.fn(),
  };
  const mockTurnModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    find: jest.fn(),
    sort: jest.fn().mockReturnThis(),
    populate: jest.fn().mockResolvedValue(['mockTurnData']),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurnService,
        {
          provide: getModelToken(Turn.name),
          useValue: mockTurnModel,
        },
        {
          provide: VehicleService,
          useValue: vehicleMockService,
        },
      ],
    }).compile();
    // Limpiar llamadas a métodos simulados entre las pruebas
    mockTurnModel.create.mockClear();
    mockTurnModel.findOne.mockClear();
    mockTurnModel.findByIdAndUpdate.mockClear();
    mockTurnModel.find.mockClear();
    mockTurnModel.sort.mockClear();
    mockTurnModel.populate.mockClear();
    vehicleMockService.findAllVehicleByUserId.mockClear();
    service = module.get<TurnService>(TurnService);
    vehicleService = module.get<VehicleService>(VehicleService);
    model = module.get<Model<any>>(getModelToken('Turn'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new turn', async () => {
    const createTurnDto = {
      patent: 'ABC123',
      date: '2023-11-05',
      hour: '10:00',
    };
    const mockTurnResult: any = {
      date: new Date(),
      hour: '',
      status: 'PENDING',
      vehicleId: 'ADASDASDSAD',
    };

    const mockVehicle: any = { _id: 'vehicle123' };

    const turnModelSpy = jest
      .spyOn(model, 'create')
      .mockImplementation(async () => {
        return Promise.resolve(mockTurnResult);
      });

    const checkIfTurnExistssSpy = jest
      .spyOn(service, 'checkIfTurnExists')
      .mockResolvedValue(false);

    const getVehicleOrThrowIfTurnExistsSpy = jest
      .spyOn(service, 'getVehicleOrThrowIfTurnExists')
      .mockResolvedValue(mockVehicle);

    const result = await service.create(createTurnDto, 'user-id');

    expect(turnModelSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockTurnResult);
    expect(checkIfTurnExistssSpy).toHaveBeenCalled();
    expect(getVehicleOrThrowIfTurnExistsSpy).toHaveBeenCalled();
  });

  it('should throw BadRequestException if a turn already exists for the given date and hour', async () => {
    const createTurnDto = {
      patent: 'ABC123',
      date: '2023-11-05',
      hour: '10:00',
    };
    const mockVehicle: any = { _id: 'vehicle123' };

    jest.spyOn(service, 'checkIfTurnExists').mockResolvedValue(true); // Simula que ya existe un turno

    jest
      .spyOn(service, 'getVehicleOrThrowIfTurnExists')
      .mockResolvedValue(mockVehicle);

    // Utilizamos el método y esperamos que lance una excepción
    await expect(service.create(createTurnDto, 'user-id')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException if vehicle has a pending turn', async () => {
    const mockPatent = 'ABC123';
    const mockUserId = 'user_id';
    const mockVehicle: any = { _id: 'vehicle123' };
    const mockTurn: any = {
      date: new Date(),
      hour: '11:20',
      status: 'PENDING',
      vehicleId: 'vehicle123',
    };
    const findByPatentAndUserIdSpy = jest
      .spyOn(vehicleService, 'findByPatentAndUserId')
      .mockResolvedValue(mockVehicle);

    const findOneTurnUserIdAndVehicleIdAndStatusMock = jest
      .spyOn(service, 'findOneTurnUserIdAndVehicleIdAndStatus')
      .mockResolvedValue(mockTurn);

    await expect(
      service.getVehicleOrThrowIfTurnExists(mockPatent, mockUserId),
    ).rejects.toThrow(BadRequestException);

    expect(findOneTurnUserIdAndVehicleIdAndStatusMock).toHaveBeenCalled();
    expect(findByPatentAndUserIdSpy).toHaveBeenCalled();
  });

  it('should create a new vehicle if it does not exist', async () => {
    const mockPatent = 'ABC123';
    const mockUserId = 'user_id';
    const mockVehicle: any = { _id: 'vehicle123' };

    const findByPatentAndUserIdSpy = jest
      .spyOn(vehicleService, 'findByPatentAndUserId')
      .mockResolvedValue(null);

    vehicleMockService.create.mockResolvedValue(mockVehicle);

    const result = await service.getVehicleOrThrowIfTurnExists(
      mockPatent,
      mockUserId,
    );

    expect(result).toBeDefined();
    expect(result).toBe(mockVehicle);
    expect(findByPatentAndUserIdSpy).toHaveBeenCalled();
  });

  it('should return true if turn exists for a given date and hour', async () => {
    const mockDate = '2023-11-05';
    const mockHour = '08:00';
    const mockTurn: any = {
      date: new Date(),
      hour: '11:20',
      status: 'PENDING',
      vehicleId: 'vehicle123',
    };

    const findOneTurnByDateAndHourMock = jest
      .spyOn(service, 'findOneTurnByDateAndHour')
      .mockResolvedValue(mockTurn);

    const result = await service.checkIfTurnExists(mockDate, mockHour);
    expect(result).toBe(true);

    expect(findOneTurnByDateAndHourMock).toHaveBeenCalledWith(
      new Date(mockDate),
      mockHour,
    );
  });

  it('should return false if turn does not exist for a given date and hour', async () => {
    const mockDate = '2023-11-05';
    const mockHour = '08:00';

    // Mock de la consulta para un turno no existente
    const findOneTurnByDateAndHourMock = jest
      .spyOn(service, 'findOneTurnByDateAndHour')
      .mockResolvedValue(null);

    const result = await service.checkIfTurnExists(mockDate, mockHour);
    expect(result).toBe(false);

    expect(findOneTurnByDateAndHourMock).toHaveBeenCalledWith(
      new Date(mockDate),
      mockHour,
    );
  });

  it('should find a turn by vehicleId and status', async () => {
    const mockVehicleId = 'vehicle_id';
    const mockStatus = 'PENDING';

    const expectedTurn = {
      date: new Date(),
      hour: '11:20',
      status: 'PENDING',
      vehicleId: 'vehicle123',
    };

    // Mock para la consulta de búsqueda de turno
    const findOneMock = jest.spyOn(service['turnModel'], 'findOne');
    findOneMock.mockResolvedValue(expectedTurn);

    const result = await service.findOneTurnUserIdAndVehicleIdAndStatus(
      mockVehicleId,
      mockStatus,
    );
    expect(result).toEqual(expectedTurn);

    expect(findOneMock).toHaveBeenCalledWith({
      vehicleId: mockVehicleId,
      status: mockStatus,
    });
  });

  it('should throw InternalServerErrorException on database error', async () => {
    const mockVehicleId = 'vehicle_id';
    const mockStatus = 'PENDING';

    // Mock para simular un error de base de datos
    const error = new Error('Database error');
    const findOneMock = jest.spyOn(service['turnModel'], 'findOne');
    findOneMock.mockRejectedValue(error);

    await expect(
      service.findOneTurnUserIdAndVehicleIdAndStatus(mockVehicleId, mockStatus),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should find available turns for a given day', async () => {
    const mockDate = '2023-11-05';
    const expectedReservedTurn: any = [
      {
        hour: '08:00',
      },
      {
        hour: '08:15',
      },
      {
        hour: '08:30',
      },
    ];
    const expectedAvailableTurn = [
      {
        hourMinute: '08:00',
        isAvailable: true,
      },
      {
        hourMinute: '09:00',
        isAvailable: true,
      },
    ];

    // Mock para la función que busca los turnos por fecha
    const findTurnByDateMock = jest
      .spyOn(service, 'findTurnByDate')
      .mockResolvedValue(expectedReservedTurn);

    // Mock para la función que genera turnos disponibles
    const availableTurnsSpy = jest
      .spyOn(availableTurns, 'getHourAvailableForDay')
      .mockResolvedValue(expectedAvailableTurn);

    const availableTurn = await service.findAvailableTurnByDay(mockDate);
    // expect(availableTurn).toEqual(expectedAvailableTurn);
    expect(findTurnByDateMock).toHaveBeenCalled();
  });

  it('should find all turns for a specific date', async () => {
    const mockDate = '2023-11-05';
    const expectedTurns = [
      {
        date: new Date('2023-11-05'),
        hour: '11:20',
        status: 'PENDING',
        vehicleId: 'vehicle123',
      },
    ];

    const dateParsed = new Date(mockDate);
    const findSpy = jest
      .spyOn(service['turnModel'], 'find')
      .mockResolvedValue(expectedTurns);

    const result = await service.findAllTurnByDate(mockDate);

    expect(result).toEqual(expectedTurns);
    expect(findSpy).toHaveBeenCalledWith({ dateParsed });
  });

  it('should return turns for a given userId', async () => {
    const userId = 'exampleUserId';
    const mockVehicles = [{ _id: 'vehicleId1' }, { _id: 'vehicleId2' }];

    vehicleMockService.findAllVehicleByUserId.mockResolvedValue(mockVehicles);
    const expectedTurns = [
      {
        date: new Date(),
        hour: '11:20',
        status: 'PENDING',
        vehicleId: 'vehicle123',
      },
    ];

    const sortMock = jest.fn().mockReturnThis();
    const populateMock = jest.fn().mockResolvedValue(expectedTurns);

    // Simular la función find para que devuelva una estructura encadenable similar a un Query de Mongoose
    const findSpy = jest.spyOn(service['turnModel'], 'find').mockReturnThis();
    findSpy.mockImplementation(
      () =>
        ({
          sort: sortMock, // Simula sort encadenado
          populate: populateMock, // Simula populate
        } as any),
    );

    const result = await service.findAllTurnByUserId(userId);

    // Verifica que find haya sido llamado con los parámetros adecuados
    expect(findSpy).toHaveBeenCalledWith(
      {
        vehicleId: {
          $in: ['vehicleId1', 'vehicleId2'],
        },
      },
      { __v: 0 },
    );
    // Verifica el encadenamiento correcto de sort y populate
    expect(sortMock).toHaveBeenCalledWith({ date: -1 });
    expect(populateMock).toHaveBeenCalledWith({
      path: 'vehicleId',
      select: '_id, patent',
    });

    // Verifica el resultado
    expect(result).toEqual(expectedTurns);
  });

  it('should update turn status correctly', async () => {
    // Mock de los datos de entrada
    const turnId = 'exampleTurnId';
    const newStatus = 'FINISHED';

    // Mock del turno actualizado después de la actualización
    const updatedTurn: any = {
      _id: turnId,
      status: newStatus,
    };
    const findByIdAndUpdateMock = jest
      .spyOn(service['turnModel'], 'findByIdAndUpdate')
      .mockResolvedValue(updatedTurn);

    const result = await service.updateTurnStatus(turnId, newStatus);

    expect(findByIdAndUpdateMock).toHaveBeenCalled();
    expect(findByIdAndUpdateMock).toHaveBeenCalledWith(
      turnId,
      { status: newStatus },
      { new: true },
    );

    expect(result).toEqual(updatedTurn);
  });
});
