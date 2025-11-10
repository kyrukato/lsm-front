import { inject, Injectable } from '@angular/core';
import { io, Manager } from 'socket.io-client';
import { UsuarioService } from './usuario.service';
import { Subject } from 'rxjs';
import { SalaBackend } from '../infrastructure/models/sala.model';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private manager:Manager;
  server = io()
  usuarioService = inject(UsuarioService);
  actualizacionDeSala$ = new Subject<SalaBackend>()
  constructor() { 
    let Token = this.usuarioService.tokenUsuario();
    this.manager = new Manager('https://backlsm-production.up.railway.app/n',{
        extraHeaders:{
            authentication: Token,
        }
    })
    this.server = this.manager.socket('/memory');
    this.server.on('connect', ()=>{
      console.log('conectado al servidor');
    });
    this.server.on('disconnect',() => {
      alert('No puede ingresar a esta modalidad por el momento');
    })
    this.server.onAny(event => console.log('onAny: ',event))
    this.server.on("sala",(args) => {
      this.actualizacionDeSala$.next(args);
    });
    this.server.connect();
  }
}
