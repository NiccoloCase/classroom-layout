import { IsEmail, IsString, ArrayUnique, Length, IsArray, ArrayMaxSize, ArrayMinSize, IsOptional } from 'class-validator';
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
    /** ID della classe */
    @IsString()
    id: string;
    /** Nome */
    @IsOptional()
    @IsString()
    @Length(2, 20)
    name?: string;
    /** Email */
    @IsOptional()
    @IsEmail()
    @IsEmailAlreadyUsed()
    email?: string;
    /** Banchi */
    @IsOptional()
    @IsArray()
    desks?: DeskInput[];
    /** Studenti */
    @IsOptional()
    @ArrayUnique()
    @ArrayMaxSize(30)
    @ArrayMinSize(2)
    @IsString({ each: true })
    students?: string[];
}

export class GetIdByEmailDTO {
    @IsEmail()
    email: string;
}