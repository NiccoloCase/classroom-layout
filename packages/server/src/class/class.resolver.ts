import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';
import { createClassDTO } from './class.types';
import { ClassService } from './class.service';


@Resolver('Class')
export class ClassResolver {

    constructor(private readonly classService: ClassService) { }


    @Query()
    getClass(@Args("id") id: string) {
        return this.classService.getClassById(id);
    }

    @Mutation()
    createClass(@Args() payload: createClassDTO) {
        return this.classService.createClass(payload);
    }

    @Mutation()
    shuffleStudents(@Args("classID") id: string) {
        return this.classService.shuffleStudents(id);
    }
}
