import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubmissionsService } from './submissions.service';
import { SubmitAnswerDto, StartSubmissionDto } from './dto';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // -----------------------------
  // START SUBMISSION
  // -----------------------------
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))   // ✅ VERY IMPORTANT
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
}

