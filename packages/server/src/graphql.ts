
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface DeskInput {
    x: number;
    y: number;
    orientation: number;
}

export interface Classroom {
    id: string;
    email: string;
    name: string;
    desks: Desk[];
    students: string[];
}

export interface Desk {
    id: string;
    x: number;
    y: number;
    orientation: number;
}

export interface EmailResponse {
    recipient: string;
    success: boolean;
}

export interface IMutation {
    createClassroom(email: string, name: string, desks: DeskInput[], students: string[]): Classroom | Promise<Classroom>;
    editClassroom(id: string, name?: string, email?: string, desks?: DeskInput[], students?: string[]): Classroom | Promise<Classroom>;
    shuffleDesks(classId: string): Classroom | Promise<Classroom>;
    sendClassroomIdByEmail(email: string): EmailResponse | Promise<EmailResponse>;
}

export interface IQuery {
    getClassroomById(id: string): Classroom | Promise<Classroom>;
    getClassroomByEmail(email: string): Classroom | Promise<Classroom>;
    isEmailAlreadyUsed(email: string): boolean | Promise<boolean>;
}
