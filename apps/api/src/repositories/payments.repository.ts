import { Injectable } from '@nestjs/common';
import { PaymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.PaymentUncheckedCreateInput) {
    return this.prisma.payment.create({ data });
  }

  attachStripeIntent(id: string, stripeIntentId: string, stripePaymentId?: string | null) {
    return this.prisma.payment.update({
      where: { id },
      data: { stripeIntentId, stripePaymentId: stripePaymentId ?? undefined },
    });
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
