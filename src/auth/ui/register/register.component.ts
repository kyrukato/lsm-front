import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthUserUseCaseService } from '../../application/user/auth-user-use-case.service';
import { HttpErrorResponse } from '@angular/common/http';
import { 
  confirmPasswordValidator,
  onlyLettersValidator,
  noSpacesValidator
} from './register.validators';

interface RegisterBodyApi {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  nickname: FormControl<string>;
}

interface RegisterForm extends RegisterBodyApi {
  confirmPassword: FormControl<string>;
}

interface errorResponse {
  isError: boolean;
  message: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule],
})
export class RegisterComponent {
    // Método para redirigir a la página de registro
    goToLogin() {
      this.router.navigate(['/login']);
    }
  authService = inject(AuthUserUseCaseService);
  router = inject(Router);

  // El formulario incluye una validación para contraseñas coincidentes
  registerForm = new FormGroup<RegisterForm>(
    {
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, onlyLettersValidator()],
      }),
      nickname: new FormControl('',{
        nonNullable: true,
        validators: [Validators.required,noSpacesValidator()],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, noSpacesValidator()],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: confirmPasswordValidator } // Asignamos la validación para contraseñas
  );

  errorHandling: errorResponse = {
    isError: false,
    message: '',
  };

  async onSumbit() {
    // console.log(this.registerForm.getRawValue());
    // console.log(this.registerForm.errors);

    if (this.registerForm.valid) {
      try {
        await firstValueFrom(
          this.authService.register(this.registerForm.getRawValue())
        );
        // En caso de que el registro sea exitoso, se redirige al usuario a la página de dashboard
        this.router.navigate(['/dashboard']);
      } catch (error: any) {
        if (error instanceof HttpErrorResponse) {
          let errorMessage = error.error.message;

          // Verificamos si el mensaje de error contiene la cadena que indica que el correo ya existe
          if (errorMessage && errorMessage.includes('already exists')) {
            errorMessage =
              'El correo electrónico ya está registrado. Por favor, utiliza otro.';
          }

          // Logueamos o mostramos el mensaje modificado
          console.error('Error en la solicitud:', errorMessage);
          this.errorHandling = {
            isError: true,
            message: errorMessage,
          };
        } else {
          // Si no es un HttpErrorResponse, logueamos el error genérico
          console.error('Error desconocido:', error);
        }
      }

      this.registerForm.reset();
    } else if (this.registerForm.errors) {
      // En caso de que el formulario sea inválido, mostramos un mensaje de error
      this.errorHandling = {
        isError: true,
        message: 'Las contraseñas no coinciden. Por favor, verifica.',
      };
    } else {
      // En caso de que el formulario sea inválido, mostramos un mensaje de error
      this.errorHandling = {
        isError: true,
        message: 'Por favor, verifica los campos del formulario.',
      };
    }
  }
}
