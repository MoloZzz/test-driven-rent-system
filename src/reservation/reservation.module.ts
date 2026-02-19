import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  providers: [ReservationService],
  imports: [PaymentModule],
})
export class ReservationModule {}
