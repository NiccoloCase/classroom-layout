import { Injectable, NotFoundException } from '@nestjs/common';
import { Class, Student } from '../graphql';
import { ClassDocument } from './class.schema';
import { createClassDTO } from './class.types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { shuffle } from "lodash"

@Injectable()
export class ClassService {

    constructor(@InjectModel('Class') private readonly classModel: Model<ClassDocument>) { }


    /**
     * Cerca una classe dal suo id
     * @param id 
     */
    async getClassById(id: string): Promise<Class> {

        try {
            const result = await this.classModel.findById(id);
            if (!result) throw new NotFoundException();
            return result;
        }
        catch (err) {
            console.error(err);
        }

    }

    /**
     * Crea e salva una nuova classe
     */
    async createClass(paypload: createClassDTO): Promise<Class> {
        const { name, students } = paypload;
        const newClass = new this.classModel({ name, students });

        try {
            await newClass.save();
            return newClass;
        }
        catch (err) {
            console.error(err);
        }
    }


    /**
     * Mescola gli studenti e aggiorna il database
     * @param classID id della classe da mischiare
     */
    async shuffleStudents(classID: string): Promise<Student[]> {

        // ottiene gli studenti
        const schoolClass = await this.classModel.findById(classID);

        // gli mescola
        schoolClass.students = shuffle(schoolClass.students);

        // salva le modifiche nel database
        await schoolClass.save();

        return schoolClass.students;
    }
}
