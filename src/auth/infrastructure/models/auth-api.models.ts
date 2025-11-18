/** Interface que contiene el token opcionalmente */
export interface TokenContainer {
  readonly token?: string;
}

/** Datos necesarios para el login */
export interface AuthData {
  readonly password: string;
  readonly email: string;
}

/** Datos necesarios para el registro */
export interface RegisterData extends AuthData {
  readonly name: string;
  readonly nickname: string;
}

/** Respuesta del login que contiene el token */
export interface LoginResponse extends TokenContainer {
  readonly email: string;
  readonly name: string;
  readonly id: string;
}

/** Respuesta del registro que contiene el token */
export interface RegisterResponse extends TokenContainer {
  readonly email: string;
  readonly name: string;
}

export interface UserToken {
  readonly id: string;
}

export interface UserResponse extends UserToken {
  readonly email: string;
  readonly name: string;
  readonly isAcive: boolean;
  readonly rol: string;
  readonly nickname: string;
}
