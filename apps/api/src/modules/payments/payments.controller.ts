import { Body, Controller, Get, Headers, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { TracedRequest } from '../../common/middleware/request-trace.middleware';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('intent')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('payments:create')
  createIntent(@Body() dto: { userId: string; amount: number; currency?: string }) {
    return this.paymentsService.createPaymentIntent(dto);
  }

  @Post('webhook')
  webhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') stripeSignature: string,
  ) {
    const event = this.stripeService.constructWebhookEvent(req.rawBody ?? Buffer.from(''), stripeSignature);
    return this.paymentsService.handleWebhookEvent(event as never);
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('payments:update')
  refund(@Req() req: TracedRequest, @Body() dto: { paymentIntentId: string }) {
    const actor = req.user as { id: string };
    return this.paymentsService.refund(dto.paymentIntentId, actor.id);
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('payments:read')
  summary() {
    return this.paymentsService.summary();
  }
}
