import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  DisableMfaDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
  SetupMfaDto,
  VerifyEmailDto,
} from './auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TracedRequest } from '../../common/middleware/request-trace.middleware';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Req() req: TracedRequest, @Res({ passthrough: true }) res: Response, @Body() dto: LoginDto) {
    const result = await this.authService.login(dto, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      deviceId: req.headers['x-device-id']?.toString(),
    });
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
      signed: true,
    });
    return {
      accessToken: result.accessToken,
      tokenType: 'Bearer',
      expiresIn: result.expiresIn,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: TracedRequest,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RefreshTokenDto,
  ) {
    const cookieToken = req.signedCookies?.refresh_token ?? req.cookies?.refresh_token;
    const refreshToken = dto.refreshToken || cookieToken;
    const result = await this.authService.refreshTokens({ refreshToken }, req.ip);
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
      signed: true,
    });
    return { accessToken: result.accessToken };
  }

  @Post('logout')
  async logout(@Req() req: TracedRequest, @Res({ passthrough: true }) res: Response, @Body() dto: RefreshTokenDto) {
    const cookieToken = req.signedCookies?.refresh_token ?? req.cookies?.refresh_token;
    await this.authService.revokeSession(dto.refreshToken || cookieToken);
    res.clearCookie('refresh_token', { path: '/api/v1/auth' });
    return { revoked: true };
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async logoutAll(@Req() req: TracedRequest, @Res({ passthrough: true }) res: Response) {
    const user = req.user as { id: string };
    await this.authService.revokeAllSessions(user.id);
    res.clearCookie('refresh_token', { path: '/api/v1/auth' });
    return { revokedAll: true };
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  setupMfa(@Req() req: TracedRequest) {
    const user = req.user as { id: string };
    return this.authService.setupMfa(user.id);
  }

  @Post('mfa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  enableMfa(@Req() req: TracedRequest, @Body() dto: SetupMfaDto) {
    const user = req.user as { id: string };
    return this.authService.enableMfa(user.id, dto);
  }

  @Post('mfa/disable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  disableMfa(@Req() req: TracedRequest, @Body() dto: DisableMfaDto) {
    const user = req.user as { id: string };
    return this.authService.disableMfa(user.id, dto);
  }

  @Get('csrf-token')
  csrfToken(@Req() req: TracedRequest) {
    return { csrfToken: req.signedCookies?.csrf_token ?? req.cookies?.csrf_token };
  }
}
