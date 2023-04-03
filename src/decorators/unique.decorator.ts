import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import UserService from 'src/services/user.service';

/**
 * Validates an email ensuring that it is not
 * in use by any other user
 * @param validationOptions Options used to pass to validation decorators.
 */
export function Unique(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
      registerDecorator({
        name: 'Unique',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: UniqueRule,
      });
    };
  }


@ValidatorConstraint({ name: 'Unique', async: true })
export class UniqueRule implements ValidatorConstraintInterface {

  async validate(value: string) {
    const user = await UserService.fetchUserByEmail(value);
    if (user) return false;
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `A user with this email already exists`;
  }
}
