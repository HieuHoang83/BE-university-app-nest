// controller/student-class.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { StudentClassService } from './class.service';
import { CreateStudentClassDto } from './dto/create-student-class.dto';
import { UpdateStudentClassDto } from './dto/update-student-class.dto';

@Controller('student-classes')
export class StudentClassController {
  constructor(private readonly studentClassService: StudentClassService) {}

  // Đăng ký sinh viên vào lớp học
  @Post()
  async create(@Body() createStudentClassDto: CreateStudentClassDto) {
    return this.studentClassService.create(createStudentClassDto);
  }

  // Lấy danh sách lớp học của sinh viên
  @Get('student/:studentId')
  async findByStudentId(@Param('studentId') studentId: string) {
    return this.studentClassService.findByStudentId(studentId);
  }

  // Lấy danh sách sinh viên trong một lớp học
  @Get('class/:classSectionId')
  async findByClassSection(@Param('classSectionId') classSectionId: string) {
    return this.studentClassService.findByClassSection(classSectionId);
  }

  // Cập nhật điểm của sinh viên trong lớp học
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentClassDto: UpdateStudentClassDto,
  ) {
    return this.studentClassService.update(id, updateStudentClassDto);
  }

  // Xóa đăng ký môn học của sinh viên
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studentClassService.remove(id);
  }
}
