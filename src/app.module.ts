import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationModule } from './reservation/reservation.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [ReservationModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
