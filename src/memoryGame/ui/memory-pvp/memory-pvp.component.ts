import { Component, computed, effect, inject, signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { ServerService } from '../../services/server.service';
import { SalaService } from '../../services/sala.service';
import { DecodeJwtService } from '../../../shared/LocalManager/decode.jwt';
import { AuthUserUseCaseService } from '../../../auth/application/user/auth-user-use-case.service';
import { MemoryApiService } from '../../infrastructure/memory-api.service';
import { MemoryPVP } from '../../infrastructure/models/memory-api.model';

@Component({
  selector: 'app-memory-pvp',
  standalone: true,
  imports: [],
  templateUrl: './memory-pvp.component.html',
  styleUrl: './memory-pvp.component.css'
})
export class MemoryPvpComponent {
  usuarioService = inject(UsuarioService);
  serverService = inject(ServerService);
  salaService = inject(SalaService);
  decodeJWTService = inject(DecodeJwtService);
  authService = inject(AuthUserUseCaseService);
  memoryService = inject(MemoryApiService)
  player1 = signal<string>('');
  player2 = signal<string>('');
  modalAbierto = signal<boolean>(false);
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  esMiTurno = computed(() => 
    (this.salaService.estado() === "TURNO_P1" && this.salaService.numeroJugador() === 1) || 
    (this.salaService.estado() === 'TURNO_P2' && this.salaService.numeroJugador() === 2));

  juegoTerminado = computed(() => {
    return this.salaService.estado() === 'VICTORIA_P1' ||
          this.salaService.estado() === 'VICTORIA_P2' ||
          this.salaService.estado() === 'EMPATE'
  });

  ganador = computed(() => {
    return this.salaService.estado() === 'VICTORIA_P1'
      ? this.player1()
      : this.player2();
  });
  jugar(posicion:number){
    this.salaService.jugar(posicion);

  }

  constructor() {
    effect(() => {
      const p1 = this.salaService.jugador1().name;
      if(p1){
        this.authService.getUserData(p1).subscribe((data) => {
          this.player1.set(data.nickname);
        })
      }
    });
    
    effect(() => {
      const p2 = this.salaService.jugador2().name;
      if(p2){
        this.authService.getUserData(p2).subscribe((data) => {
          this.player2.set(data.nickname);
        })
      }
    });

    effect(()=>{
      if(this.juegoTerminado()) {
        setTimeout(() => {this.modalAbierto.set(true)}, 0);
        if(this.ganador() === this.player1()){
          const token = this.salaService.jugador1().name;
          const userID = this.decodeJWTService.decodeId(token);
          const data:MemoryPVP = {
            userID: userID,
          }
          this.memoryService.updateVictorys(data).subscribe((response) => {
            console.log(response);
          });
        } else if(this.ganador() === this.player2()){
          const token = this.salaService.jugador2().name;
          const userID = this.decodeJWTService.decodeId(token);
          const data:MemoryPVP = {
            userID: userID,
          }
          this.memoryService.updateVictorys(data).subscribe((response) => {
            console.log(response);
          });
        }
      }
    });
  }

  async findRoom() {
    this.serverService.server.emitWithAck('encontrarSala').then(res =>{
      console.log("Respuesta del server: ",res);
      if(res === null) {
        this.salaService.crearSala();
      }
      else{
        this.salaService.unirseASala(res);
      }
    })
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.findRoom(); // 🔹 Buscar nueva partida al cerrar el modal
  }
}
