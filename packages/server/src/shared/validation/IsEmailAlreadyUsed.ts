import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { Injectable } from "@nestjs/common";
import { ClassroomService } from "../../classroom/classroom.service";


@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailAlreadyUsedConstraint implements ValidatorConstraintInterface {
    constructor(protected readonly classroomService: ClassroomService) { }

    async validate(email: string, args: ValidationArguments) {
        const classroom = await this.classroomService.findClassroomByEmail(email);
        if (classroom) return false;
        else return true
    }
}

export function IsEmailAlreadyUsed(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailAlreadyUsedConstraint
        });
    };
}