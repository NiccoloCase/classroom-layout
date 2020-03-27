import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ClassroomService } from './classroom.service';
import { NewClassroomDTO, EditClassroomDTO } from './classroom.dto';
import { NotFoundException } from '@nestjs/common';


@Resolver('Classroom')
export class ClassroomResolver {
    constructor(private readonly classroomService: ClassroomService) { }

    @Query()
    async getClassroomById(@Args("id") id: string) {
        const classroom = await this.classroomService.findClassroomById(id);
        if (!classroom) throw new NotFoundException();
        return classroom;
    }

    @Query()
    async getClassroomByEmail(@Args("email") email: string) {
        const classroom = await this.classroomService.findClassroomByEmail(email);
        if (!classroom) throw new NotFoundException();
        return classroom;
    }

    @Query()
    async isEmailAlreadyUsed(@Args("email") email: string) {
        const classroom = await this.classroomService.findClassroomByEmail(email);
        if (!classroom) return false
        return true;
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
