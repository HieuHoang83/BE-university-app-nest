import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IUser } from 'src/interface/users.interface';
import { User } from 'src/decorators/customize';
import { UpdateSettingWithDevicesDto } from './dto/update-setting.dto';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  create(@Body() createSettingDto: CreateSettingDto, @User() user: IUser) {
    return this.settingService.create(createSettingDto, user);
  }

  @Get('user')
  findByUser(@User() user: IUser) {
    return this.settingService.findByUser(user.id);
  }

  @Get('device/:deviceId')
  findByDevice(@Param('deviceId') deviceId: string) {
    return this.settingService.findByDevice(deviceId);
  }
  @Get('/:settingId')
  findBySetting(@Param('settingId') setting: string) {
    return this.settingService.findBySetting(setting);
  }

  @Patch()
  update(@Body() updateSettingDto: UpdateSettingWithDevicesDto) {
    return this.settingService.update(updateSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingService.remove(id);
  }
}
