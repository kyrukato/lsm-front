import { effect, inject, Injectable, signal } from '@angular/core';
import { LocalKeys, LocalManagerService } from '../../shared/LocalManager/storage.servicee';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor() { 
    const token = LocalManagerService.getElement(LocalKeys.token);
    if(token) this.tokenUsuario.set(token);
  }

  tokenUsuario = signal<string>("");
}
