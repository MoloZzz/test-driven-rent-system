import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let mockUserRepository: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('charge', () => {
    it('should charge user successfully (deduct amount from balance, return { success: true, newBalance })', async () => {
      const userId = 1;
      const amount = 50;
      const user = { id: userId, balance: 100 };
      const updatedUser = { id: userId, balance: 50 };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.charge(userId, amount);

      expect(result).toEqual({ success: true, newBalance: 50 });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...user,
        balance: 50,
      });
    });

    it('should throw BadRequestException if user not found', async () => {
      const userId = 999;
      const amount = 50;

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.charge(userId, amount)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if not enough balance', async () => {
      const userId = 1;
      const amount = 150;
      const user = { id: userId, balance: 100 };

      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(service.charge(userId, amount)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if amount is zero or negative', async () => {
      const userId = 1;

      await expect(service.charge(userId, 0)).rejects.toThrow(
        BadRequestException,
      );

      await expect(service.charge(userId, -50)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
