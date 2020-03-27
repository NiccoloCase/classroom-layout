import { IsEmail, IsString, ArrayUnique, Length } from 'class-validator';
import { IsEmailAlreadyUsed } from '../shared/validation';

export class NewClassroomDTO {
    @IsEmail()
    @IsEmailAlreadyUsed()
    email: string;
    @IsString()
    @Length(2, 20)
    name: string;
    @IsString()
    desks: string;
    @ArrayUnique()
    students: string[];
}

export class EditClassroomDTO {
    @IsString()
    @Length(2, 20)
    name?: string;
    @IsString()
    desks?: string;
    @ArrayUnique()
    students?: string[];
}