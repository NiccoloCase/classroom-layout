import { Module } from '@nestjs/common';
import { join } from "path";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose"
import { ClassroomModule } from './classroom/classroom.module';
import config from "config";

@Module({
  imports: [
    // DATABASEs
    MongooseModule.forRoot(config.database.URI,
      { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }),
    // GRAPHQL 
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      debug: !config.isProduction,
      playground: !config.isProduction,
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
    ClassroomModule]
})
export class AppModule { }
