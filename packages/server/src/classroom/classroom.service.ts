import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as _ from "lodash";
import { InjectModel } from '@nestjs/mongoose';
import { Classroom } from '../graphql';
import { IClassroomModel } from './classroom.schema';
import { Model } from 'mongoose';
import { NewClassroomDTO, EditClassroomDTO } from './classroom.dto';

@Injectable()
export class ClassroomService {

    constructor(@InjectModel("Classroom") private readonly classroomModel: Model<IClassroomModel>) { }

    /**
     * Restituisce la classe associata all'ID dato
     * @param id 
     */
    async findClassroomById(id: string): Promise<Classroom | null> {
        try {
            const classroom = await this.classroomModel.findById(id);
            return classroom;
        }
        catch (err) {
            throw new BadRequestException();
        }
    }

    /**
     * Restituisce la classe associata all'email dato
     * @param id 
     */
    async findClassroomByEmail(email: string): Promise<null | Classroom> {
        try {
            const classroom = await this.classroomModel.findOne({ email });
            return classroom;
        }
        catch (err) {
            throw new BadRequestException();
        }

    }

    /**
     * Crea una nuova classe
     * @param payload 
     */
    async createNewClassroom(payload: NewClassroomDTO): Promise<Classroom> {
        const newClassroom = new this.classroomModel(payload);
        await newClassroom.save();
        return newClassroom;
    }

    /**
     *  Modifica la classe, associata all'Id, secondo i parametri passtai
     * @param id  ID della classe da modificare
     * @param edits  Modifiche
     */
    async editClassroom(id: string, edits: EditClassroomDTO): Promise<Classroom> {
        let classroom: Classroom;
        try {
            classroom = await this.classroomModel.findByIdAndUpdate(id, edits, { new: true, });
        } catch (err) {
            throw new BadRequestException();
        }
        if (!classroom) throw new NotFoundException();
        return classroom;
    }

    /**
     * Cambia i posti
     * [mescola gli studenti]
     */
    async shuffleStudents(id: string): Promise<Classroom> {
        // trova la classe 
        try {
            const classroom = await this.classroomModel.findById(id);
            if (!classroom) throw new NotFoundException();
            classroom.students = _.shuffle(classroom.students);
            await classroom.save();
            return classroom;
        }
        catch (err) {
            throw new BadRequestException();
        }
    }
}
