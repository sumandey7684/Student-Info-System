import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiBearerAuth()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('oauth/google')
  oauthGoogle() {
    return { message: 'OAuth2 flow placeholder. Configure Google strategy next.' };
  }
}
