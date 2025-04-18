// service/student-class.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateStudentClassDto } from './dto/create-student-class.dto';
import { UpdateStudentClassDto } from './dto/update-student-class.dto';

@Injectable()
export class StudentClassService {
  constructor(private readonly prisma: PrismaService) {}

  // Đăng ký sinh viên vào lớp học
  async create(createStudentClassDto: CreateStudentClassDto) {
    const { studentId, classSectionId } = createStudentClassDto;

    // Sử dụng findFirst để tìm bản ghi có studentId và classSectionId
    const existingRegistration = await this.prisma.studentClass.findFirst({
      where: {
        studentId: studentId,
        classSectionId: classSectionId,
      },
    });

    if (existingRegistration) {
      throw new BadRequestException('Sinh viên đã đăng ký lớp học này rồi');
    }

    try {
      return await this.prisma.studentClass.create({
        data: createStudentClassDto,
      });
    } catch (error) {
      throw new BadRequestException(
        'Không thể đăng ký lớp học: ' + error.message,
      );
    }
  }

  // Lấy danh sách các lớp học mà sinh viên đã đăng ký
  async findByStudentId(studentId: string) {
    const studentClasses = await this.prisma.studentClass.findMany({
      where: { studentId },
      include: {
        classSection: {
          include: {
            course: true,
            professor: true,
          },
        },
      },
    });

    if (!studentClasses.length) {
      throw new NotFoundException('Sinh viên chưa đăng ký lớp học nào');
    }

    return studentClasses;
  }

  // Lấy tất cả lớp học theo mã sinh viên
  async findByClassSection(classSectionId: string) {
    const classSections = await this.prisma.studentClass.findMany({
      where: { classSectionId },
      include: {
        student: true,
      },
    });

    if (!classSections.length) {
      throw new NotFoundException('Không có sinh viên nào trong lớp học này');
    }

    return classSections;
  }

  // Cập nhật điểm cho sinh viên trong lớp học
  async update(id: string, updateStudentClassDto: UpdateStudentClassDto) {
    try {
      return await this.prisma.studentClass.update({
        where: { id },
        data: updateStudentClassDto,
      });
    } catch (error) {
      throw new BadRequestException(
        'Không thể cập nhật thông tin lớp học: ' + error.message,
      );
    }
  }

  // Xóa đăng ký môn học của sinh viên
  async remove(id: string) {
    try {
      return await this.prisma.studentClass.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(
        'Không thể xóa đăng ký lớp học: ' + error.message,
      );
    }
  }
}
