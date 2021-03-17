import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const CustumValidationPipe = new ValidationPipe({
  exceptionFactory: (validationErrors: ValidationError[]) => {
    const errors = validationErrors.map(error => {
      const codes = getCustomCodes(error.constraints);
      return {
        field: error.property,
        value: error.value,
        codes,
      };
    });
    return new BadRequestException({
      name: 'VALIDATION_ERROR',
      message: 'Validation error',
      errors,
    });
  },
});

/**
 * Restituisce i codici degli errori
 * @param constraints
 */
const getCustomCodes = (constraints: { [type: string]: string }): string[] => {
  const keys = Object.keys(constraints);
  const codes = keys.map(constraint => {
    switch (constraint) {
      case 'isEmail':
        return 'IS_NOT_EMAIL';
      case 'length':
        return 'LENGTH_IS_WRONG';
      case 'arrayUnique':
        return 'ARRAY_IS_NOT_UNIQUE';
      case 'IsEmailAlreadyUsedConstraint':
        return 'EMAIL_IS_ALREADY_USED';
      default:
        return constraint;
    }
  });

  return codes;
};
