import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  // Tạo mới phòng ban
  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      return await this.prisma.department.create({
        data: createDepartmentDto,
      });
    } catch (error) {
      throw new BadRequestException(
        'Không thể tạo phòng ban: ' + error.message,
      );
    }
  }

  // Lấy danh sách tất cả phòng ban
  async findAll() {
    return await this.prisma.department.findMany();
  }

  // Lấy thông tin phòng ban theo ID
  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException('Phòng ban không tồn tại');
    }

    return department;
  }

  // Cập nhật thông tin phòng ban
  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    try {
      return await this.prisma.department.update({
        where: { id },
        data: updateDepartmentDto,
      });
    } catch (error) {
      throw new BadRequestException(
        'Không thể cập nhật phòng ban: ' + error.message,
      );
    }
  }

  // Xóa phòng ban
  async remove(id: string) {
    try {
      return await this.prisma.department.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(
        'Không thể xoá phòng ban: ' + error.message,
      );
    }
  }
}
