import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmitAnswerDto, StartSubmissionDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // -----------------------------
  // START SUBMISSION
  // -----------------------------
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('start')
  startSubmission(
    @Body() dto: StartSubmissionDto,
    @Req() req: any,
  ) {
    const user = req.user || req.raw?.user;

    if (!user) {
      console.log('AUTH HEADER:', req.headers.authorization);
      throw new Error('User not attached from JWT');
    }

    return this.submissionsService.startSubmission(
      dto.testId,
      user.userId,
    );
  }

  // -----------------------------
  // SUBMIT ANSWER
  // -----------------------------
  @UseGuards(JwtAuthGuard, RolesGuard)   // ✅ VERY IMPORTANT
  @Post(':submissionId/answer')
  submitAnswer(
    @Param('submissionId') submissionId: string,
    @Body() dto: SubmitAnswerDto,
    @Req() req: any,
  ) {
    const user = req.user || req.raw?.user;

    if (!user) {
      console.log('AUTH HEADER:', req.headers.authorization);
      console.log('REQ.USER:', req.user);
      console.log('REQ.RAW.USER:', req.raw?.user);
      throw new Error('User not attached from JWT');
    }

    return this.submissionsService.submitAnswer(
      submissionId,
      dto,
      user.userId,
    );
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
@Get('me')
getMySubmissions(@Req() req: any) {
  return this.submissionsService.getSubmissionsByUser(req.user.userId);
}

@Get('me/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
getMyAnalytics(@Req() req: any) {
  return this.submissionsService.getStudentAnalytics(req.user.userId);
}


}

