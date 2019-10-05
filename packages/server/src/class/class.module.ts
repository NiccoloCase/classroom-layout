import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassResolver } from './class.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { classSchema } from './class.schema';

@Module({
  imports: [MongooseModule.forFeature([{ schema: classSchema, name: "Class" }])],
  providers: [ClassService, ClassResolver]
})
export class ClassModule { }
