import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from '../application/admin.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { CreateDevotionalDto } from './dto/create-devotional.dto';
import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import { RolesGuard } from '../../auth/presentation/roles.guard';
import { Roles } from '../../auth/presentation/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get overall app stats for admin studio' })
  getStats() {
    return this.adminService.getStats();
  }

  // --- TOPICS ---
  @Get('topics')
  @ApiOperation({ summary: 'Get all topics for admin management' })
  getTopics() {
    return this.adminService.getAllTopics();
  }

  @Post('topics')
  @ApiOperation({ summary: 'Create new topic with YouTube video and practices' })
  createTopic(@Body() dto: CreateTopicDto) {
    return this.adminService.createTopic(dto);
  }

  @Put('topics/:id')
  @ApiOperation({ summary: 'Update existing topic' })
  updateTopic(@Param('id') id: string, @Body() dto: CreateTopicDto) {
    return this.adminService.updateTopic(id, dto);
  }

  @Delete('topics/:id')
  @ApiOperation({ summary: 'Delete topic' })
  deleteTopic(@Param('id') id: string) {
    return this.adminService.deleteTopic(id);
  }

  // --- DEVOTIONALS ---
  @Get('devotionals')
  @ApiOperation({ summary: 'Get all devotionals' })
  getDevotionals() {
    return this.adminService.getAllDevotionals();
  }

  @Post('devotionals')
  @ApiOperation({ summary: 'Create new devotional' })
  createDevotional(@Body() dto: CreateDevotionalDto) {
    return this.adminService.createDevotional(dto);
  }

  @Put('devotionals/:id')
  @ApiOperation({ summary: 'Update devotional' })
  updateDevotional(@Param('id') id: string, @Body() dto: CreateDevotionalDto) {
    return this.adminService.updateDevotional(id, dto);
  }

  @Delete('devotionals/:id')
  @ApiOperation({ summary: 'Delete devotional' })
  deleteDevotional(@Param('id') id: string) {
    return this.adminService.deleteDevotional(id);
  }

  // --- FOCUS AREAS / STRENGTHS ---
  @Get('focus-areas')
  @ApiOperation({ summary: 'Get all focus areas / strengths' })
  getFocusAreas() {
    return this.adminService.getAllFocusAreas();
  }

  @Post('focus-areas')
  @ApiOperation({ summary: 'Create new focus area / strength' })
  createFocusArea(
    @Body() dto: { name: string; description?: string; order?: number },
  ) {
    return this.adminService.createFocusArea(dto);
  }

  @Put('focus-areas/:id')
  @ApiOperation({ summary: 'Update focus area / strength' })
  updateFocusArea(
    @Param('id') id: string,
    @Body()
    dto: {
      name?: string;
      description?: string;
      order?: number;
      isActive?: boolean;
    },
  ) {
    return this.adminService.updateFocusArea(Number(id), dto);
  }

  @Delete('focus-areas/:id')
  @ApiOperation({ summary: 'Delete focus area / strength' })
  deleteFocusArea(@Param('id') id: string) {
    return this.adminService.deleteFocusArea(Number(id));
  }
}
