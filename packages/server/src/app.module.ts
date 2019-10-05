import { Module } from '@nestjs/common';
import { join } from "path";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose"
// moduli
import { ClassModule } from './class/class.module';

@Module({
  imports: [
    // DATABASE
    MongooseModule.forRoot("mongodb://admin:AdminDatabas3@ds331198.mlab.com:31198/school-room-layout"),
    // GRAPHQL 
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      debug: false,
      playground: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }), ClassModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
