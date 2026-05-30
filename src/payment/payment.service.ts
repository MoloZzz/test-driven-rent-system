import { Inject, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor(@Inject('UserRepository') private userRepository: any) {}

  async charge(userId: number, amount: any) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const updatedUser = { ...user, balance: user.balance - amount };
    await this.userRepository.save(updatedUser);

    return { success: true, newBalance: updatedUser.balance };
  }
}
