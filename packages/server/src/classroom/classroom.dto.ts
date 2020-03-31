import { IsEmail, IsString, ArrayUnique, Length, IsArray, ArrayMaxSize, ArrayMinSize } from 'class-validator';
import { IsEmailAlreadyUsed, HasSameLength } from '../shared/validation';
import { DeskInput } from '../graphql';

export class NewClassroomDTO {
    /** Email */
    @IsEmail()
    @IsEmailAlreadyUsed()
    email: string;
    /** Nome */
    @IsString()
    @Length(2, 20)
    name: string;
    /** Banchi */
    @IsArray()
    @HasSameLength("students")
    desks: DeskInput[];
    /** Studenti */
    @ArrayUnique()
    @ArrayMaxSize(30)
    @ArrayMinSize(2)
    @IsString({ each: true })
    students: string[];
}

export class EditClassroomDTO {
    /** Nome */
    @IsString()
    @Length(2, 20)
    name?: string;
    /** Banchi */
    @IsArray()
    @HasSameLength("students")
    desks?: DeskInput[];
    /** Studenti */
    @ArrayUnique()
    @ArrayMaxSize(30)
    @ArrayMinSize(2)
    @IsString({ each: true })
    students?: string[];
}