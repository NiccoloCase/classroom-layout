import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as _ from "lodash";
import { InjectModel } from '@nestjs/mongoose';
import { Classroom } from '../graphql';
import { IClassroomModel } from './classroom.schema';
import { Model } from 'mongoose';
import { NewClassroomDTO, EditClassroomDTO } from './classroom.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class ClassroomService {
    constructor(
        @InjectModel("Classroom") private readonly classroomModel: Model<IClassroomModel>,
        private readonly emailService: EmailService
    ) { }

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
    async editClassroom(payload: EditClassroomDTO): Promise<Classroom> {
        let classroom: Classroom;
        const { id } = payload;
        delete payload.id;

        try {
            classroom = await this.classroomModel.findByIdAndUpdate(id, payload, { new: true, });
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

    /**
     * Spedisce un email contenete l'ID dell classe associata all'email
     */
    async  sendIdByEmail(email: string) {
        // cerca la classe associata all'email
        const classroom = await this.findClassroomByEmail(email);
        if (!classroom) throw new BadRequestException();
        // spedisce l'email con l'ID 
        const res = await this.emailService.sendClassroomId(email, classroom.id);
        if (res.success === false) throw new InternalServerErrorException();
    }
}
