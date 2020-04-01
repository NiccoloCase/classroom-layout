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
        // rimuove i valori vuoti
        for (let propName in args) {
            if (args[propName] === null || args[propName] === undefined)
                delete args[propName];
        }
        const edits = { ...args };
        delete edits.id;

        return this.classroomService.editClassroom(args.id, edits);
    }

    @Mutation()
    async shuffleDesks(@Args("classId") id: string) {
        return this.classroomService.shuffleStudents(id);
    }
}
