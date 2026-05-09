import { Injectable, UnauthorizedException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly client = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2024-06-20',
  });

  createPaymentIntent(params: {
    amount: number;
    currency: string;
    metadata: Record<string, string>;
    idempotencyKey: string;
  }) {
    return this.client.paymentIntents.create(
      {
        amount: Math.round(params.amount * 100),
        currency: params.currency,
        metadata: params.metadata,
        automatic_payment_methods: { enabled: true },
      },
      { idempotencyKey: params.idempotencyKey },
    );
  }

  constructWebhookEvent(rawBody: Buffer, signature: string) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new UnauthorizedException('Stripe webhook secret missing');
    return this.client.webhooks.constructEvent(rawBody, signature, secret);
  }

  createRefund(paymentIntentId: string, reason?: Stripe.RefundCreateParams.Reason) {
    return this.client.refunds.create({ payment_intent: paymentIntentId, reason });
  }
}
