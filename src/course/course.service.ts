import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { AssignProfessorToCourseDto } from './dto/professor-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Tạo môn học mới
  async create(dto: CreateCourseDto) {
    try {
      return await this.prisma.course.create({
        data: {
          name: dto.name,
          code: dto.code,
          department: {
            connect: { id: dto.departmentId }, // Dùng connect để liên kết với department
          },
          // Không cần thêm professor nếu không có thông tin giảng viên
        },
      });
    } catch (error) {
      throw new BadRequestException('Không thể tạo môn học: ' + error.message);
    }
  }

  // ✅ Lấy danh sách tất cả môn học
  async findAll() {
    return await this.prisma.course.findMany({
      include: {
        department: true, // Bao gồm thông tin khoa
        professors: {
          include: {
            professor: {
              include: {
                user: true, // Bao gồm thông tin người dùng của giảng viên
              },
            },
          },
        },
      },
    });
  }

  // ✅ Lấy thông tin môn học theo ID
  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        department: true, // Bao gồm thông tin khoa
        professors: {
          include: {
            professor: {
              include: {
                user: true, // Bao gồm thông tin người dùng của giảng viên
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Môn học không tồn tại');
    }

    return course;
  }

  // ✅ Cập nhật thông tin môn học
  async update(id: string, dto: UpdateCourseDto) {
    try {
      return await this.prisma.course.update({
        where: { id },
        data: {
          name: dto.name,
          code: dto.code,
          department: dto.departmentId
            ? { connect: { id: dto.departmentId } }
            : undefined, // Nếu có departmentId, liên kết
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Không thể cập nhật môn học: ' + error.message,
      );
    }
  }

  // ✅ Xoá môn học
  async remove(id: string) {
    try {
      return await this.prisma.course.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException('Không thể xoá môn học: ' + error.message);
    }
  }

  // ✅ Gán giảng viên vào môn học
  async assignProfessor(dto: AssignProfessorToCourseDto) {
    // Kiểm tra nếu giảng viên đã được gán vào môn học này
    const existing = await this.prisma.professorCourse.findUnique({
      where: {
        professorId_courseId: {
          professorId: dto.professorId,
          courseId: dto.courseId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Giảng viên đã được gán vào môn học này');
    }

    return await this.prisma.professorCourse.create({
      data: {
        professorId: dto.professorId,
        courseId: dto.courseId,
      },
    });
  }
  async findByDepartment(departmentId: string) {
    try {
      const courses = await this.prisma.course.findMany({
        where: {
          departmentId, // Lọc theo departmentId
        },
        select: {
          id: true,
          name: true,
          code: true,
          department: {
            select: {
              name: true,
            },
          },
        },
      });
      return courses;
    } catch (error) {
      throw new BadRequestException(
        'Không thể lấy danh sách môn học theo phòng ban',
      );
    }
  }

  // ✅ Lấy tất cả môn học theo ID giảng viên (chỉ hiển thị thông tin môn học)
  async findByProfessor(professorId: string) {
    try {
      const courses = await this.prisma.course.findMany({
        where: {
          professors: {
            some: {
              professorId: professorId, // Lọc các môn học có giảng viên tương ứng
            },
          },
        },
        select: {
          id: true,
          name: true,
          code: true,
          department: {
            select: {
              name: true,
            },
          },
        },
      });
      return courses;
    } catch (error) {
      throw new BadRequestException(
        'Không thể lấy danh sách môn học theo giảng viên',
      );
    }
  }
}
