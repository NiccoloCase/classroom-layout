import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
    async findClassroomById(id: string): Promise<Classroom> {
        let classroom: Classroom;
        try {
            classroom = await this.classroomModel.findById(id);
        }
        catch (err) {
            throw new BadRequestException();
        }

        if (!classroom) throw new NotFoundException();
        return classroom;
    }

    /**
     * Restituisce la classe associata all'email dato
     * @param id 
     */
    async findClassroomByEmail(email: string): Promise<null | Classroom> {
        let classroom: Classroom | null;
        try {
            classroom = await this.classroomModel.findOne({ email });
        }
        catch (err) {
            throw new BadRequestException();
        }
        return classroom;
    }

    /**
     * Crea una nuova classe
     * @param payload 
     */
    async createNewClassroom(payload: NewClassroomDTO): Promise<Classroom> {
        const newClassroom = new this.classroomModel({ ...payload })
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
            classroom = await this.classroomModel.findByIdAndUpdate(id, edits, { new: true });
        } catch (err) {
            throw new BadRequestException();
        }
        if (!classroom) throw new NotFoundException();
        return classroom;
    }


}
