import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';
import { AuthRequest } from 'src/auth/interface/auth-request.interface';

@Controller('reviews')
@ApiTags('Reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: AuthRequest) {
    return this.reviewsService.create(createReviewDto, req.user.user_id);
  }

  @Get()
  @Public()
  @ApiQuery({
    name: 'tasker_id',
    required: false,
    type: Number,
    description: 'ID of the tasker to get reviews',
  })
  @ApiQuery({
    name: 'task_id',
    required: false,
    type: Number,
    description: 'ID of specific review',
  })
  findAll(
    @Query('tasker_id') tasker_id?: string,
    @Query('task_id') review_id?: string,
  ) {
    if (tasker_id) {
      return this.reviewsService.findAll(Number(tasker_id));
    }
    if (review_id) {
      return this.reviewsService.findOne(Number(review_id));
    }
    throw new BadRequestException(
      'Either tasker_id or task_id must be provided',
    );
  }
}
