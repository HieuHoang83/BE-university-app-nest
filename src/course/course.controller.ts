import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { AssignProfessorToCourseDto } from './dto/professor-course.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // ✅ Tạo môn học mới
  @Post()
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }
  @Get('department/:departmentId')
  async findByDepartment(@Param('departmentId') departmentId: string) {
    try {
      return await this.courseService.findByDepartment(departmentId);
    } catch (error) {
      throw new BadRequestException(
        'Không thể lấy danh sách môn học theo phòng ban',
      );
    }
  }

  // ✅ Lấy tất cả môn học theo ID giảng viên
  @Get('professor/:professorId')
  async findByProfessor(@Param('professorId') professorId: string) {
    try {
      return await this.courseService.findByProfessor(professorId);
    } catch (error) {
      throw new BadRequestException(
        'Không thể lấy danh sách môn học theo giảng viên',
      );
    }
  }
  // ✅ Lấy danh sách tất cả môn học
  @Get()
  findAllCourses() {
    return this.courseService.findAll();
  }

  // ✅ Lấy thông tin một môn học theo ID
  @Get(':id')
  findOneCourse(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.courseService.findOne(id);
  }

  // ✅ Cập nhật thông tin môn học
  @Put(':id')
  updateCourse(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(id, updateCourseDto);
  }

  // ✅ Xoá một môn học
  @Delete(':id')
  removeCourse(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.courseService.remove(id);
  }

  // ✅ Gán giảng viên vào môn học
  @Post('assign-professor')
  assignProfessorToCourse(@Body() dto: AssignProfessorToCourseDto) {
    return this.courseService.assignProfessor(dto);
  }
}
