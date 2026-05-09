import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { QueueService } from '../queue/queue.service';
import { PaymentsRepository } from '../../repositories/payments.repository';
import { AuditLogsRepository } from '../../repositories/audit-logs.repository';
import { TransactionManager } from '../../repositories/transaction.manager';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly stripeService: StripeService,
    private readonly queueService: QueueService,
    private readonly auditLog: AuditLogService,
    private readonly auditLogsRepository: AuditLogsRepository,
    private readonly transactionManager: TransactionManager,
  ) {}

  async createPaymentIntent(data: { userId: string; amount: number; currency?: string }) {
    const currency = data.currency ?? 'usd';
    const payment = await this.paymentsRepository.create({
      userId: data.userId,
      amount: data.amount,
      currency,
      status: PaymentStatus.PENDING,
    });

    const intent = await this.stripeService.createPaymentIntent({
      amount: data.amount,
      currency,
      metadata: { paymentId: payment.id, userId: data.userId },
      idempotencyKey: randomUUID(),
    });

    await this.paymentsRepository.attachStripeIntent(
      payment.id,
      intent.id,
      intent.latest_charge?.toString(),
    );
    return { paymentId: payment.id, clientSecret: intent.client_secret };
  }

  async handleWebhookEvent(event: { id: string; type: string; data: { object: { id: string } } }) {
    const replayKey = `stripe:webhook:${event.id}`;
    const alreadyProcessed = await this.auditLogsRepository.findStripeWebhookReplay(
      'PAYMENT_WEBHOOK',
      event.id,
    );
    if (alreadyProcessed) return { skipped: true };

    const stripeIntentId = event.data.object.id;
    let status: PaymentStatus = PaymentStatus.PENDING;
    if (event.type === 'payment_intent.succeeded') status = PaymentStatus.SUCCEEDED;
    if (event.type === 'payment_intent.payment_failed') status = PaymentStatus.FAILED;
    if (event.type === 'charge.refunded') status = PaymentStatus.REFUNDED;

    await this.transactionManager.run(async (tx) => {
      await this.paymentsRepository.updateByIntent(stripeIntentId, status, tx);
      await this.auditLogsRepository.create(
        {
          action: 'PAYMENT_WEBHOOK',
          resource: 'PAYMENT',
          resourceId: event.id,
          status: 'SUCCESS',
          metadata: { type: event.type, stripeIntentId },
        },
        tx,
      );
    });

    await this.queueService.enqueueNotification('payment-status-changed', {
      stripeIntentId,
      status,
      replayKey,
    });
    return { processed: true };
  }

  async refund(paymentIntentId: string, actorId?: string) {
    const refund = await this.stripeService.createRefund(paymentIntentId, 'requested_by_customer');
    await this.auditLog.create({
      actorId,
      action: 'PAYMENT_REFUND',
      resource: 'PAYMENT',
      resourceId: paymentIntentId,
      status: 'SUCCESS',
      metadata: { refundId: refund.id },
    });
    return refund;
  }

  async summary() {
    const [count, revenue] = await this.paymentsRepository.getSummary();
    return {
      successfulTransactions: count,
      totalRevenue: revenue._sum.amount ?? 0,
    };
  }
}
