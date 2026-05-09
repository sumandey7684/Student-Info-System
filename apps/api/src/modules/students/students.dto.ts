import { IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  fullName!: string;

  @IsString()
  email!: string;

  @IsString()
  registration!: string;

  @IsString()
  gradeLevel!: string;

  @IsOptional()
  @IsString()
  guardianNote?: string;
}

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @IsOptional()
  @IsString()
  guardianNote?: string;
}
