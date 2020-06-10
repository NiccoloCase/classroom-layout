import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFeedbackModel } from './feedback.schema';
import { SendFeedbackDTO } from './feedback.dto';
import { ProcessResult } from '../graphql';

@Injectable()
export class FeedbackService {
    constructor(@InjectModel("Feedback") private readonly feedbackModel: Model<IFeedbackModel>) { }

    async  createFeedback(data: SendFeedbackDTO): Promise<ProcessResult> {
        try {
            const newFeedback = new this.feedbackModel(data);
            await newFeedback.save();
            return { success: true };
        }
        catch (err) {
            throw new BadRequestException();
        }
    }
}
