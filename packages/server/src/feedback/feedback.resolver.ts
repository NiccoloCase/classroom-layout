import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { FeedbackService } from './feedback.service';
import { SendFeedbackDTO } from './feedback.dto';

@Resolver('Feedback')
export class FeedbackResolver {
    constructor(private readonly feedbackService: FeedbackService) { }

    @Mutation()
    sendFeedback(@Args() payload: SendFeedbackDTO) {
        return this.feedbackService.createFeedback(payload);
    }
}
