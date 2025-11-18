import { inject, Injectable, signal } from '@angular/core';
import { ServerService } from './server.service';
import { UsuarioService } from './usuario.service';
import { Jugador } from '../infrastructure/models/Jugador.model';
import { EstadoJuego, statusRespuesta, SalaBackend } from '../infrastructure/models/sala.model';
import { CrearSalaArgs } from '../infrastructure/models/crearSala.model';
import { unirseASalaArgs } from '../infrastructure/models/unirseSala.model';

@Injectable({
  providedIn: 'root'
})
export class SalaService {
  serverService = inject(ServerService);
  usuarioService = inject(UsuarioService);

  constructor() { 
    this.serverService.actualizacionDeSala$.subscribe((sala)=> {
      this.desestructurarSala(sala);
    });
  }

  jugador1 = signal<Jugador>({name:''});
  jugador2 = signal<Jugador>({name:''});
  imageURL = signal<string>('');
  /*Debes de estar al pendiente de esta señal para saber cuando termina el juego
  y quien lo gana
  */
  estado = signal<EstadoJuego> ("ESPERANDO_JUGADOR");
  name = signal<string>('');
  respuesta = signal<statusRespuesta>('ESPERANDO_RESPUESTA');
  numeroJugador = signal<1|2|undefined>(undefined);
  id = signal<number|undefined>(undefined);

  
  desestructurarSala(salaBack:SalaBackend){
    console.log('desestructurando: ',salaBack);
    this.id.set(salaBack.roomID);
    this.jugador1.set(salaBack.players[0]);
    this.jugador2.set(salaBack.players[1]);
    this.estado.set(salaBack.status);
    this.imageURL.set(salaBack.imageURL);
    this.name.set(salaBack.signal);
  }

  crearSala(esPrivada:boolean = false){
    console.log('Creando sala para jugador',this.usuarioService.tokenUsuario());
    const args:CrearSalaArgs={
      publica: !esPrivada,
      userID: this.usuarioService.tokenUsuario(),
    }
    this.serverService.server.emitWithAck('crearSala',args).then(res => {
      this.desestructurarSala(res.sala);
      this.numeroJugador.set(1);
      console.log('Crear sala',res);
    })
  }

  unirseASala(id:number){
    const args:unirseASalaArgs = {
      roomID: id,
      userID: this.usuarioService.tokenUsuario(),
    }
    this.serverService.server.emitWithAck('unirseASala',args).then(res =>{
      console.log('Resultado de unión a sala',res);
      this.numeroJugador.set(2);
      this.desestructurarSala(res.sala);
    })
  }
  /*
    Tienes que injectar el servicio para poder llamar este método y de la caja de texto tomas la respuesta  
    del jugador y se manda al server
  */
  jugar(respuestaJugador:string){
    if(respuestaJugador.toLocaleUpperCase() === this.name()){
      this.respuesta.set('CORRECTA');
    }
    else{
      this.respuesta.set('INCORRECTA');
    }
    console.log('Respuesta Jugador',respuestaJugador,' Estado de la respuesta: ',this.respuesta());
    this.serverService.server.emit("jugar",{
      salaId: this.id(),
      jugador: this.numeroJugador(),
      status: this.respuesta(),
    })
  }

  /**
   * Esta función solo se utiliza cuando al jugador se le acaba el tiempo para responder
   * Injectando el servicio lo puedes utilizar
   */
  tiempoAgotado(){
    this.respuesta.set('TIEMPO_AGOTADO')
    this.serverService.server.emit("jugar",{
      salaId: this.id(),
      jugador: this.numeroJugador(),
      status: this.respuesta(),
    })
  }
}
