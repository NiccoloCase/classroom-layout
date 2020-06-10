import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackResolver } from './feedback.resolver';
import { MongooseModule } from '../../../../node_modules/@nestjs/mongoose';
import { FeedbackSchema } from './feedback.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: "Feedback", schema: FeedbackSchema }])],
  providers: [FeedbackService, FeedbackResolver]
})
export class FeedbackModule { }
