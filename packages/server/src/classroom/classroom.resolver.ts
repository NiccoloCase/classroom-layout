import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ClassroomService } from './classroom.service';
import { NewClassroomDTO, EditClassroomDTO } from './classroom.dto';


@Resolver('Classroom')
export class ClassroomResolver {

    constructor(private readonly classroomService: ClassroomService) { }

    @Query()
    async getClassroomById(@Args("id") id: string) {
        return await this.classroomService.findClassroomById(id);
    }

    @Mutation()
    async createClassroom(@Args() args: NewClassroomDTO) {
        return await this.classroomService.createNewClassroom(args);
    }

    @Mutation()
    async editClassroom(@Args() args) {
        const changes: EditClassroomDTO = {
            name: args.name,
            desks: args.desks,
            students: args.students
        }
        return await this.classroomService.editClassroom(args.id, changes);
    }
}
