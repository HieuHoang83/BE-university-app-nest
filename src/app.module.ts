import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { DepartmentModule } from './department/department.module';
import { ClassModule } from './class/class.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //gioi han luot goi api/ 1 may sd
    ThrottlerModule.forRoot([
      {
        ttl: 60000, //mili giay
        limit: 10, //gioi han trong n giay do
      },
    ]),
    UsersModule,
    AuthModule,
    CourseModule,
    DepartmentModule,
    ClassModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
