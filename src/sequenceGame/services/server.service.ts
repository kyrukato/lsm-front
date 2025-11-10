import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Manager } from 'socket.io-client';
import { UsuarioService } from './usuario.service';
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
    this.manager = new Manager('https://backlsm-yctc.onrender.com/n',{
      extraHeaders:{
          authentication: Token,
      }
    })
    this.server = this.manager.socket('/sequence');
    this.server.on('connect', ()=>{
      console.log('conectado al servidor');
    });
    this.server.onAny(event => console.log('onAny: ',event))
    this.server.on("sala",(args) => {
      this.actualizacionDeSala$.next(args);
    });
    this.server.connect();
  }
}
