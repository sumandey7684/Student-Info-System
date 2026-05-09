import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('payments:create')
  createIntent(@Body() dto: { userId: string; amount: number; currency?: string }) {
    return this.paymentsService.createPaymentIntent(dto);
  }

  @Post('webhook')
  webhook(
    @Headers('stripe-signature') stripeSignature: string,
    @Body() dto: { stripeIntentId: string; status: 'SUCCEEDED' | 'FAILED' | 'REFUNDED' },
  ) {
    if (!stripeSignature) {
      throw new Error('Missing stripe signature header');
    }
    return this.paymentsService.handleWebhook(dto);
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('payments:read')
  summary() {
    return this.paymentsService.summary();
  }
}
