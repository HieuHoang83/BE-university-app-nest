import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string; // Họ và tên

  @IsOptional()
  @IsString()
  password?: string; // Mật khẩu (có thể thay đổi)

  @IsOptional()
  @IsEmail()
  universityEmail?: string; // Email trường đại học

  @IsOptional()
  @IsString()
  phoneNumber?: string; // Số điện thoại

  @IsOptional()
  @IsString()
  socialMedia?: string; // Mạng xã hội

  @IsOptional()
  @IsString()
  address?: string; // Địa chỉ

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string; // Ngày sinh

  @IsOptional()
  @IsString()
  gender?: string; // Giới tính

  @IsOptional()
  @IsString()
  placeOfBirth?: string; // Nơi sinh

  @IsOptional()
  @IsString()
  profilePicture?: string; // Ảnh đại diện
}
