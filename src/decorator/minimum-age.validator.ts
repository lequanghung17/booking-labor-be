import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class MinimumAgeConstraint implements ValidatorConstraintInterface {
  validate(dateOfBirth: string, args: ValidationArguments): boolean {
    const today = new Date();
    const dob = new Date(dateOfBirth);

    // Lấy tham số độ tuổi từ decorator
    const minAge = args.constraints[0];
    const age = today.getFullYear() - dob.getFullYear();
    const isOldEnough =
      age > minAge ||
      (age === minAge &&
        today >= new Date(dob.setFullYear(dob.getFullYear() + minAge)));

    return isOldEnough;
  }

  defaultMessage(args: ValidationArguments): string {
    const minAge = args.constraints[0];
    return `Người dùng phải lớn hơn ${minAge} tuổi`;
  }
}

export function MinimumAge(age: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [age],
      options: validationOptions,
      validator: MinimumAgeConstraint,
    });
  };
}
