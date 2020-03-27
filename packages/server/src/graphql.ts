
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface Classroom {
    id: string;
    email: string;
    name: string;
    desks: string;
    students: string[];
}

export interface IMutation {
    createClassroom(email: string, name: string, desks: string, students: string[]): Classroom | Promise<Classroom>;
    editClassroom(id: string, name?: string, desks?: string, students?: string[]): Classroom | Promise<Classroom>;
}

export interface IQuery {
    getClassroomById(id: string): Classroom | Promise<Classroom>;
    getClassroomByEmail(email: string): Classroom | Promise<Classroom>;
    isEmailAlreadyUsed(email: string): boolean | Promise<boolean>;
}
