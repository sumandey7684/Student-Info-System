import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    return {
      message: 'User registered',
      user: { email: dto.email, fullName: dto.fullName },
    };
  }

  async login(dto: LoginDto) {
    const accessToken = await this.jwtService.signAsync({
      sub: dto.email,
      roles: ['STUDENT'],
    });

    return {
      accessToken,
      tokenType: 'Bearer',
    };
  }
}
