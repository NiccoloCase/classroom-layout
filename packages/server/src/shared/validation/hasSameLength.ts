import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidatorOptions } from "class-validator";

/**
 * Controlla che l'array in esame abbia la stessa lunghezza del'array corrispondente 
 * al numo del campo passato
 * @param secondArrayField 
 * @param validationOptions 
 */
export function HasSameLength(secondArrayField, validationOptions?: ValidatorOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [secondArrayField],
            validator: HasSameLengthConstraint
        });
    };
}

@ValidatorConstraint({ name: "hasSameLength", async: false })
export class HasSameLengthConstraint implements ValidatorConstraintInterface {
    validate(propertyValue: any[], args: ValidationArguments) {

        const a = propertyValue;
        const b = args.object[args.constraints[0]];
        if (!Array.isArray(a) || !Array.isArray(b)) return false
        return a.length === b.length;
    }
    defaultMessage(args: ValidationArguments) {
        return `the array "${args.property}" does not have the same length of the array "${args.constraints[0]}"`;
    }
}