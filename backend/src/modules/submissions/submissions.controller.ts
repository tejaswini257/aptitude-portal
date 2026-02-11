import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { SubmissionsService } from './submissions.service';
import { SubmitAnswerDto, StartSubmissionDto } from './dto';

@Controller('submissions')
@UseGuards(JwtGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // START TEST ATTEMPT
  @Post('start')
  async startSubmission(@Body() dto: StartSubmissionDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.submissionsService.startSubmission(dto.testId, userId);
  }

  // SUBMIT ANSWER
  @Post(':submissionId/answer')
  async submitAnswer(
    @Param('submissionId') submissionId: string,
    @Body() dto: SubmitAnswerDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.submissionsService.submitAnswer(
      submissionId,
      dto,
      userId,
    );
  }

  // GET STUDENT SUBMISSIONS (for dashboard later)
  @Get('me')
  async mySubmissions(@Req() req: any) {
    return this.submissionsService.getSubmissionsByUser(req.user.userId);
  }
}
