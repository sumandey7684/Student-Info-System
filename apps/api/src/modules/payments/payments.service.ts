import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPaymentIntent(data: { userId: string; amount: number; currency?: string }) {
    return this.prisma.payment.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        currency: data.currency ?? 'usd',
        status: 'PENDING',
      },
    });
  }

  async handleWebhook(data: { stripeIntentId: string; status: 'SUCCEEDED' | 'FAILED' | 'REFUNDED' }) {
    return this.prisma.payment.updateMany({
      where: { stripeIntentId: data.stripeIntentId },
      data: {
        status: data.status,
        paidAt: data.status === 'SUCCEEDED' ? new Date() : null,
      },
    });
  }

  async summary() {
    const [count, revenue] = await Promise.all([
      this.prisma.payment.count({ where: { status: 'SUCCEEDED' } }),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCEEDED' },
        _sum: { amount: true },
      }),
    ]);
    return {
      successfulTransactions: count,
      totalRevenue: revenue._sum.amount ?? 0,
    };
  }
}
