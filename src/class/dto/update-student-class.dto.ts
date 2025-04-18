import { IsOptional, IsString } from 'class-validator';

export class UpdateStudentClassDto {
  @IsOptional()
  @IsString()
  grade?: string;
}
