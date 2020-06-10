import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomResolver } from './classroom.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassroomSchema } from './classroom.schema';
import { IsEmailAlreadyUsedConstraint, HasSameLengthConstraint } from '../shared/validation';
import { EmailService } from '../email/email.service';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Classroom", schema: ClassroomSchema }]),
    TokenModule
  ],
  providers: [
    ClassroomService,
    ClassroomResolver,
    IsEmailAlreadyUsedConstraint,
    HasSameLengthConstraint,
    EmailService
  ]
})
export class ClassroomModule { }
