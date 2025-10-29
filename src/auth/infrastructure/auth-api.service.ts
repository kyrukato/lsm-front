import { inject, Injectable } from '@angular/core';
import { AuthApi } from './auth-api.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { delay, map, Observable, pipe, tap } from 'rxjs';
import {
  AuthData,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  UserResponse,
  UserToken,
} from './models/auth-api.models';
import {
  LocalKeys,
  LocalManagerService,
} from '../../shared/LocalManager/storage.servicee';
import { DecodeJwtService } from '../../shared/LocalManager/decode.jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService implements AuthApi {
  private _httpClient = inject(HttpClient);
  private _decodeJwtService = inject(DecodeJwtService);
  private readonly URL_AUTH = environment.URL_AUTH;
  private readonly AuthEndpoints = {
    login: '/login',
    logout: '/logout',
    register: '/register',
    update: '/update',
  };

  login(user: AuthData): Observable<LoginResponse> {
    const { email, password } = user;
    return this._httpClient
      .post<LoginResponse>(`${this.URL_AUTH}${this.AuthEndpoints.login}`, {
        email,
        password,
      })
      .pipe(
        map((result) => {
          if (result.token) {
            LocalManagerService.setElement(LocalKeys.token, result.token);
          }
          LocalManagerService.setElement(LocalKeys.email, result.email);
          LocalManagerService.setElement(LocalKeys.name, result.name);
          return result;
        })
      );
  }

  logout() {
    LocalManagerService.clearStorage();
  }

  register(
    user: RegisterData
    // confirmPassword: string
  ): Observable<RegisterResponse> {
    const { name, email, password, nickname } = user;

    return this._httpClient
      .post<RegisterResponse>(
        `${this.URL_AUTH}${this.AuthEndpoints.register}`,
        {
          email,
          password,
          name,
          nickname,
          // confirmPassword,
        }
      )
      .pipe(
        map((result) => {
          if (result.token) {
            LocalManagerService.setElement(LocalKeys.token, result.token);
          }
          LocalManagerService.setElement(LocalKeys.email, result.email);
          LocalManagerService.setElement(LocalKeys.name, result.name);
          return result;
        })
      );
  }

  update(id: string): Observable<UserResponse> {
    return this._httpClient.post<UserResponse>(
      `${this.URL_AUTH}${this.AuthEndpoints.update}`,
      {
        id,
      }
    );
  }

  isLoggedIn() {
    return LocalManagerService.getElement(LocalKeys.token) !== null;
  }

  getUserData(token: string): Observable<UserResponse> {
    const id = this._decodeJwtService.decodeId(token);
    // console.log(id);
    // delay(5000);
    return this._httpClient.get<UserResponse>(`${this.URL_AUTH}/${id}`);
  }
}
