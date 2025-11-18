import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServerService } from '../../services/server.service';
import { UsuarioService } from '../../services/usuario.service';
import { SalaService } from '../../services/sala.service';
import { GuessUseCaseService } from '../../application/guess-use-case.service';
import { DecodeJwtService } from '../../../shared/LocalManager/decode.jwt';
import { LocalKeys, LocalManagerService } from '../../../shared/LocalManager/storage.servicee';
import { AuthUserUseCaseService } from '../../../auth/application/user/auth-user-use-case.service';
import { GuessPVP } from '../../infrastructure/models/guess-api.model';
import { response } from 'express';

@Component({
  selector: 'app-pvp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pvp.component.html',
  styleUrls: ['./pvp.component.css'],
})
export class PvpComponent {
  usuarioService = inject(UsuarioService);
  serverService = inject(ServerService);
  salaService = inject(SalaService);
  guessUseCase = inject(GuessUseCaseService);
  decodeJWTService = inject(DecodeJwtService);
  authService = inject(AuthUserUseCaseService);

  player1 = signal<string>('')

  player2 = signal<string>('');
  
  respuestaUsuario = signal<string>('');
  modalAbierto = signal<boolean>(false); // 🔹 Nuevo: Controla si el modal está visible

  // ✅ Computed: Determina si el juego ha terminado y quién ganó
  juegoTerminado = computed(() => {
    return this.salaService.estado() === 'VICTORIA_P1' || this.salaService.estado() === 'VICTORIA_P2';
  });

  ganador = computed(() => {
    return this.salaService.estado() === 'VICTORIA_P1' 
      ? this.player1() 
      : this.player2();
  });

  constructor() {
    effect(() => {
      const id1 = this.salaService.jugador1().name;
      if (id1) {
        this.authService.getUserData(id1).subscribe(data => {
          this.player1.set(data.nickname);
        });
      }
    });

    // 👉 Cargar nombre de player2 cuando exista el ID
    effect(() => {
      const id2 = this.salaService.jugador2().name;
      if (id2) {
        this.authService.getUserData(id2).subscribe(data => {
          this.player2.set(data.nickname);
        });
      }
    });
    effect(() => {
      if (this.juegoTerminado()) {
        setTimeout(() => this.modalAbierto.set(true), 0); // ✅ Sin necesidad de `allowSignalWrites`
        if(this.ganador() === this.player1()){
          const token = this.salaService.jugador1().name;
          const userID = this.decodeJWTService.decodeId(token);
          const data: GuessPVP = {
            userID: userID
          }
          this.guessUseCase.updateVictorys(data).subscribe((response)=>{
            console.log('Respuesta player1: ',response);
          });
        } else{
          const token = this.salaService.jugador2().name;
          const userID = this.decodeJWTService.decodeId(token);

          const data: GuessPVP = {
            userID: userID,
          }
          this.guessUseCase.updateVictorys(data).subscribe((response)=>{
            console.log('Respuesta Player2: ',response)
          });
        }
      }
    });
    
  }

  async findRoom() {
    this.salaService.respuesta.set('ESPERANDO_RESPUESTA'); // 🔹 Resetea el estado de respuesta
    this.modalAbierto.set(false); // 🔹 Cierra el modal
    this.serverService.server.emitWithAck('encontrarSala').then(res => {
      console.log("Respuesta del server: ", res);
      if (res === null) {
        this.salaService.crearSala();
      } else {
        this.salaService.unirseASala(res);
      }
    });
  }
  

  jugar() {
    this.salaService.jugar(this.respuestaUsuario());
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.findRoom(); // 🔹 Buscar nueva partida al cerrar el modal
  }
}
