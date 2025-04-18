import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDate,
  ValidateNested,
} from 'class-validator';

export enum UserRole {
  STUDENT = 'STUDENT',
  PROFESSOR = 'Professor',
  ADMIN = 'Admin',
}

// DTO chứa thông tin sinh viên
class StudentInfoDto {
  @IsString()
  studentId: string; // Mã số sinh viên

  @IsString()
  department: string; // Khoa của sinh viên

  @IsOptional()
  @IsString()
  major?: string; // Ngành học (tuỳ chọn)

  @IsOptional()
  @IsString()
  classId?: string; // Mã lớp học (tuỳ chọn)
}

// DTO chứa thông tin giảng viên
class ProfessorInfoDto {
  @IsString()
  professorId: string; // Mã số giảng viên

  @IsString()
  departmentId: string; // Mã khoa giảng viên thuộc về
}

// DTO chính để tạo user
export class CreateUserDto {
  @IsString()
  fullName: string; // Họ và tên

  @IsString()
  password: string; // Mật khẩu (không cần validate vì có thể được mã hóa)

  @IsEmail()
  universityEmail: string; // Email trường đại học

  @IsEnum(UserRole)
  role: UserRole; // Vai trò người dùng

  // Tùy chọn thông tin sinh viên
  @IsOptional()
  @ValidateNested()
  @Type(() => StudentInfoDto)
  studentInfo?: StudentInfoDto; // Thông tin sinh viên

  // Tùy chọn thông tin giảng viên
  @IsOptional()
  @ValidateNested()
  @Type(() => ProfessorInfoDto)
  professorInfo?: ProfessorInfoDto; // Thông tin giảng viên
}
