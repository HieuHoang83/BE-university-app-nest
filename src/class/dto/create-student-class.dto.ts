import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateStudentClassDto {
  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @IsNotEmpty()
  @IsUUID()
  classSectionId: string;

  @IsOptional()
  @IsString()
  grade?: string;
}
