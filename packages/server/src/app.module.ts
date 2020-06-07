import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { join } from "path";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose"
import { ClassroomModule } from './classroom/classroom.module';
import { ServeWebAppMiddleware } from './shared/app.middleware';
import { EmailModule } from './email/email.module';
import config from "@crl/config";

@Module({
  imports: [
    // DATABASE
    MongooseModule.forRoot(config.database.URI,
      { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }),
    // GRAPHQL 
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      path: "/api/graphql",
      debug: !config.isProduction,
      playground: !config.isProduction,
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
    // altro
    EmailModule,
    ClassroomModule
  ]
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ServeWebAppMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
