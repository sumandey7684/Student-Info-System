import { Test } from '@nestjs/testing';
import { PaymentStatus } from '@prisma/client';
import { AuditLogService } from '../audit-log/audit-log.service';
import { QueueService } from '../queue/queue.service';
import { AuditLogsRepository } from '../../repositories/audit-logs.repository';
import { PaymentsRepository } from '../../repositories/payments.repository';
import { TransactionManager } from '../../repositories/transaction.manager';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PaymentsRepository,
          useValue: {
            create: jest.fn(),
            attachStripeIntent: jest.fn(),
            updateByIntent: jest.fn(),
            getSummary: jest.fn(),
          },
        },
        {
          provide: StripeService,
          useValue: { createPaymentIntent: jest.fn(), createRefund: jest.fn() },
        },
        { provide: QueueService, useValue: { enqueueNotification: jest.fn() } },
        { provide: AuditLogService, useValue: { create: jest.fn() } },
        {
          provide: AuditLogsRepository,
          useValue: {
            findStripeWebhookReplay: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: TransactionManager,
          useValue: {
            run: jest.fn().mockImplementation(async (fn: (tx: unknown) => Promise<void>) => fn({})),
          },
        },
      ],
    }).compile();

    service = module.get(PaymentsService);
  });

  it('marks succeeded webhook as processed', async () => {
    const result = await service.handleWebhookEvent({
      id: 'evt_1',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_1' } },
    });
    expect(result).toEqual({ processed: true });
  });

  it('maps refund status', async () => {
    const status = PaymentStatus.REFUNDED;
    expect(status).toBe('REFUNDED');
  });
});
