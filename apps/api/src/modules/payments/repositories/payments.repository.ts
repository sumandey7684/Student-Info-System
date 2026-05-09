import { Injectable } from '@nestjs/common';
import { Prisma, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.PaymentUncheckedCreateInput) {
    return this.prisma.payment.create({ data });
  }

  updateByIntent(stripeIntentId: string, status: PaymentStatus, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.payment.updateMany({
      where: { stripeIntentId },
      data: { status, paidAt: status === PaymentStatus.SUCCEEDED ? new Date() : null },
    });
  }

  getSummary() {
    return Promise.all([
      this.prisma.payment.count({ where: { status: PaymentStatus.SUCCEEDED } }),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.SUCCEEDED },
        _sum: { amount: true },
      }),
    ]);
  }
}
