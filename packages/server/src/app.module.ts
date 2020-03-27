import { Module, ValidationPipe } from '@nestjs/common';
import { join } from "path";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose"
import { ClassroomModule } from './classroom/classroom.module';


@Module({
  imports: [
    // DATABASEs
    MongooseModule.forRoot("mongodb://admin:AdminDatabas3@ds331198.mlab.com:31198/school-room-layout"),
    // GRAPHQL 
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      debug: false,
      playground: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
    ClassroomModule]
})
export class AppModule { }
