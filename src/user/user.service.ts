import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { IUser } from 'src/interface/users.interface';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  private hashPassword(password: string): string {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  private checkPassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }

  // ✅ Thêm user mới vào database
  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        universityEmail: createUserDto.universityEmail,
      },
    });

    if (existingUser) {
      throw new Error('Email already in use');
    }
    if (
      createUserDto.role === UserRole.STUDENT &&
      createUserDto.studentInfo?.studentId
    ) {
      const existingStudent = await this.prismaService.student.findUnique({
        where: {
          studentId: createUserDto.studentInfo.studentId,
        },
      });

      if (existingStudent) {
        throw new Error('Mã số sinh viên đã tồn tại');
      }
    }

    // Kiểm tra professorId nếu là giảng viên
    if (
      createUserDto.role === UserRole.PROFESSOR &&
      createUserDto.professorInfo?.professorId
    ) {
      const existingProfessor = await this.prismaService.professor.findUnique({
        where: {
          professorId: createUserDto.professorInfo.professorId,
        },
      });

      if (existingProfessor) {
        throw new Error('Mã số giảng viên đã tồn tại');
      }
    }
    const { role, studentInfo, professorInfo, ...userData } = createUserDto;

    userData.password = this.hashPassword(createUserDto.password);
    const user = await this.prismaService.user.create({
      data: {
        ...userData,
        role,
      },
    });
    return userData;
    // Trả về đối tượng user đã tạo
    if (role === UserRole.STUDENT) {
      if (!studentInfo) {
        throw new Error('Student information is required');
      }

      // Tạo Student
      await this.prismaService.student.create({
        data: {
          ...studentInfo,
          userId: user.id,
        },
      });
    } else if (role === UserRole.PROFESSOR) {
      if (!professorInfo) {
        throw new Error('Professor information is required');
      }

      // Tạo Professor
      await this.prismaService.professor.create({
        data: {
          ...professorInfo,
          userId: user.id,
        },
      });
    }

    return user; // Trả về đối tượng user đã tạo
  }

  // ✅ Lấy danh sách tất cả users
  async findAll() {
    try {
      return await this.prismaService.user.findMany();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneById(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { universityEmail: email },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.findOneByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (!this.checkPassword(password, user.password)) {
        throw new BadRequestException('Wrong password');
      }

      return user; // Trả về user (hoặc tạo JWT tại đây)
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ✅ Cập nhật thông tin user
  async update(user: IUser, updateUserDto: UpdateUserDto) {
    try {
      return await this.prismaService.user.update({
        where: { id: user.id },
        data: updateUserDto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async updateRefreshToken(userId: string, refreshToken: string | null) {
    try {
      return await this.prismaService.user.update({
        where: { id: userId },
        data: { refreshToken },
      });
    } catch (error) {
      throw new BadRequestException('Cập nhật refresh token thất bại');
    }
  }
  // ✅ Xóa user theo ID
  async remove(id: string) {
    try {
      return await this.prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException('User not found or already deleted');
    }
  }
}
