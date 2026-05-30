import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create.dto';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class ReservationService {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepo: any,
    @Inject('ReservationRepository')
    private readonly reservationRepo: any,
    @Inject('PaymentService')
    private readonly paymentService: PaymentService,
    @Inject('AvailabilityService')
    private readonly availabilityService: any,
    @Inject('PricingService')
    private readonly pricingService: any,
  ) {}

  async createReservation(dto: CreateReservationDto) {
    const room = await this.roomRepo.findById(dto.roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    const isAvailable = await this.availabilityService.isAvailable(
      dto.roomId,
      dto.checkIn,
      dto.checkOut,
    );
    if (!isAvailable) {
      throw new BadRequestException('Room is not available');
    }
    const amount = this.pricingService.calculate(
      room,
      dto.checkIn,
      dto.checkOut,
    );
    await this.paymentService.charge(dto.userId, amount);
    const reservation = await this.reservationRepo.save({
      roomId: dto.roomId,
      userId: dto.userId,
      checkIn: dto.checkIn,
      checkOut: dto.checkOut,
      amount,
    });
    return { reservationId: reservation.id };
  }
}
