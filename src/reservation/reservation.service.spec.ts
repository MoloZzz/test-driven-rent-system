import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReservationService', () => {
  let service: ReservationService;
  const roomRepo = {
    findById: jest.fn(),
  };

  const reservationRepo = {
    save: jest.fn(),
  };

  const paymentService = {
    charge: jest.fn(),
  };

  const availabilityService = {
    isAvailable: jest.fn(),
  };

  const pricingService = {
    calculate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        { provide: 'RoomRepository', useValue: roomRepo },
        { provide: 'ReservationRepository', useValue: reservationRepo },
        { provide: 'PaymentService', useValue: paymentService },
        { provide: 'AvailabilityService', useValue: availabilityService },
        { provide: 'PricingService', useValue: pricingService },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);

    jest.clearAllMocks();
  });

  it('should create reservation successfully', async () => {
    const dto = {
      roomId: 1,
      userId: 1,
      checkIn: new Date('2026-05-10'),
      checkOut: new Date('2026-05-15'),
    };

    roomRepo.findById.mockResolvedValue({ id: '1', price: 100 });
    availabilityService.isAvailable.mockResolvedValue(true);
    pricingService.calculate.mockReturnValue(500);
    paymentService.charge.mockResolvedValue({ success: true });
    reservationRepo.save.mockResolvedValue({ id: 1 });

    const result = await service.createReservation(dto);

    expect(result).toEqual({ reservationId: 1 });

    expect(roomRepo.findById).toHaveBeenCalledWith(1);
    expect(availabilityService.isAvailable).toHaveBeenCalled();
    expect(pricingService.calculate).toHaveBeenCalled();
    expect(paymentService.charge).toHaveBeenCalledWith(1, 500);
    expect(reservationRepo.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if room does not exist', async () => {
  const dto = {
    roomId: 1,
    userId: 1,
    checkIn: new Date('2026-05-10'),
    checkOut: new Date('2026-05-15'),
  };

  roomRepo.findById.mockResolvedValue(null);

  await expect(service.createReservation(dto))
    .rejects
    .toThrow(NotFoundException);

  expect(availabilityService.isAvailable).not.toHaveBeenCalled();
  expect(pricingService.calculate).not.toHaveBeenCalled();
  expect(paymentService.charge).not.toHaveBeenCalled();
  expect(reservationRepo.save).not.toHaveBeenCalled();
});

it('should throw BadRequestException if checkOut <= checkIn', async () => {
  const dto = {
    roomId: 1,
    userId: 1,
    checkIn: new Date('2026-05-15'),
    checkOut: new Date('2026-05-10'),
  };
    roomRepo.findById.mockResolvedValue({ id: '1', price: 100 });
    availabilityService.isAvailable.mockResolvedValue(false);
    pricingService.calculate.mockReturnValue(500);
    paymentService.charge.mockResolvedValue({ success: true });
    reservationRepo.save.mockResolvedValue({ id: 1 });
    
  await expect(service.createReservation(dto))
    .rejects
    .toThrow(BadRequestException);

  expect(pricingService.calculate).not.toHaveBeenCalled();
  expect(paymentService.charge).not.toHaveBeenCalled();
  expect(reservationRepo.save).not.toHaveBeenCalled();
});
});
