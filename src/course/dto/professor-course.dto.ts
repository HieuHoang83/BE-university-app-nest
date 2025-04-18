import { IsUUID, IsNotEmpty } from 'class-validator';

export class AssignProfessorToCourseDto {
  @IsNotEmpty()
  @IsUUID()
  professorId: string;

  @IsNotEmpty()
  @IsUUID()
  courseId: string;
}
