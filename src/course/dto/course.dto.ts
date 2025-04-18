import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsUUID()
  departmentId: string;
}

export class UpdateCourseDto {
  @IsString()
  name?: string;

  @IsString()
  code?: string;

  @IsUUID()
  departmentId?: string;
}
