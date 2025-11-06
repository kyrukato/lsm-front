import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
) => {
  return control.value.password === control.value.confirmPassword
    ? null
    : { PasswordNotMatch: true };
};

export function onlyLettersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;

    // Acepta letras con acentos y espacios
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return regex.test(value)
      ? null
      : { onlyLetters: true };
  };
}

export function noSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;

    return value.includes(' ')
      ? { noSpaces: true }
      : null;
  };
}

