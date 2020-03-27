import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomResolver } from './classroom.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassroomSchema } from './classroom.schema';
import { IsEmailAlreadyUsedConstraint } from '../shared/validation';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Classroom", schema: ClassroomSchema }]),
  ],
  providers: [ClassroomService, ClassroomResolver, IsEmailAlreadyUsedConstraint]
})
export class ClassroomModule { }
