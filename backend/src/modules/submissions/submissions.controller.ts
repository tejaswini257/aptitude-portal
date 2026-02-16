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
import { SubmitAnswerDto, StartSubmissionDto, SubmitBulkDto } from './dto';

@Controller('submissions')
@UseGuards(JwtGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  private getUserId(req: any): string {
    return req.user?.userId ?? req.user?.id;
  }

  // START TEST ATTEMPT
  @Post('start')
  async startSubmission(@Body() dto: StartSubmissionDto, @Req() req: any) {
    return this.submissionsService.startSubmission(dto.testId, this.getUserId(req));
  }

  // BULK SUBMIT (all answers at once)
  @Post(':submissionId/submit-bulk')
  async submitBulk(
    @Param('submissionId') submissionId: string,
    @Body() dto: SubmitBulkDto,
    @Req() req: any,
  ) {
    return this.submissionsService.submitBulk(
      submissionId,
      dto.answers,
      this.getUserId(req),
    );
  }

  // SUBMIT ANSWER (single)
  @Post(':submissionId/answer')
  async submitAnswer(
    @Param('submissionId') submissionId: string,
    @Body() dto: SubmitAnswerDto,
    @Req() req: any,
  ) {
    const userId = this.getUserId(req);
    return this.submissionsService.submitAnswer(
      submissionId,
      dto,
      userId,
    );
  }

  // GET STUDENT SUBMISSIONS (for dashboard later)
  @Get('me')
  async mySubmissions(@Req() req: any) {
    return this.submissionsService.getSubmissionsByUser(this.getUserId(req));
  }

  @Post(':submissionId/finish')
  async finishSubmission(
    @Param('submissionId') submissionId: string,
    @Req() req: any,
  ) {
    return this.submissionsService.finishSubmission(
      submissionId,
      this.getUserId(req),
    );
  }
}
