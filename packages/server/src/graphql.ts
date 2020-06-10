
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum TokenScope {
    DELETE_CLASSROOM = "DELETE_CLASSROOM"
}

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

export interface Feedback {
    selectedValues: string[];
    textField?: string;
    email: string;
}

export interface IMutation {
    createClassroom(email: string, name: string, desks: DeskInput[], students: string[]): Classroom | Promise<Classroom>;
    editClassroom(id: string, name?: string, email?: string, desks?: DeskInput[], students?: string[]): Classroom | Promise<Classroom>;
    shuffleDesks(classId: string): Classroom | Promise<Classroom>;
    sendClassroomIdByEmail(email: string): EmailResponse | Promise<EmailResponse>;
    requestClassroomDeletion(id: string): TokenGenerationResult | Promise<TokenGenerationResult>;
    deleteClassroom(token: string): ProcessResult | Promise<ProcessResult>;
    sendFeedback(email: string, selectedValues: string[], textField?: string): ProcessResult | Promise<ProcessResult>;
}

export interface ProcessResult {
    success: boolean;
}

export interface IQuery {
    getClassroomById(id: string): Classroom | Promise<Classroom>;
    getClassroomByEmail(email: string): Classroom | Promise<Classroom>;
    isEmailAlreadyUsed(email: string): boolean | Promise<boolean>;
}

export interface Token {
    id: string;
    email: string;
    scope: TokenScope;
}

export interface TokenGenerationResult {
    email: string;
    tokenDigits: number;
}
