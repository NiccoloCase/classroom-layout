import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as _ from "lodash";
import { InjectModel } from '@nestjs/mongoose';
import { Classroom, TokenScope, TokenGenerationResult, ProcessResult } from '../graphql';
import { IClassroomModel } from './classroom.schema';
import { Model } from 'mongoose';
import { NewClassroomDTO, EditClassroomDTO } from './classroom.dto';
import { EmailService } from '../email/email.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class ClassroomService {
    constructor(
        @InjectModel("Classroom") private readonly classroomModel: Model<IClassroomModel>,
        private readonly emailService: EmailService,
        private readonly tokenService: TokenService
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

    /**
     * Manda un'email all'utente per ottenere il conseno riguardo
     * l'eliminazione di una classe
     */
    async requestClassroomDeletion(classId: string): Promise<TokenGenerationResult> {
        // trova la classe associata all'id
        const classroom = await this.findClassroomById(classId);
        if (!classroom) throw new BadRequestException();
        // genera un token
        const { email, name } = classroom;
        const { id: token } = await this.tokenService.generateNewToken(email, TokenScope.DELETE_CLASSROOM);

        // manda il token all'utente via email
        const result = await this.emailService.sendPurgeToken(email, token, name);
        if (!result.success) throw new InternalServerErrorException();

        return {
            email,
            tokenDigits: token.length
        }
    }

    /**
     * Elimina una classe 
     */
    async deleteClassroom(tokenString: string): Promise<ProcessResult> {
        // controlla che il token sia valido 
        const { email } = await
            this.tokenService.readAndCheckTokenById(tokenString, TokenScope.DELETE_CLASSROOM);

        // elimina la classe
        const result = await this.classroomModel.deleteOne({ email });
        if (!result.n) throw new BadRequestException();

        return { success: true }
    }
}
