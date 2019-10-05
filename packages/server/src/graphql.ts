
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export interface InputStudent {
    name: string;
}

export interface Class {
    id: string;
    name: string;
    students: Student[];
}

export interface IMutation {
    createClass(name: string, students: InputStudent[]): Class | Promise<Class>;
    shuffleStudents(classID: string): Student[] | Promise<Student[]>;
}

export interface IQuery {
    getClass(id: string): Class | Promise<Class>;
}

export interface Student {
    name: string;
    id: string;
}
