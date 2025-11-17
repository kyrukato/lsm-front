import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServerService } from '../../services/server.service';
import { UsuarioService } from '../../services/usuario.service';
import { SalaService } from '../../services/sala.service';

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
  
  respuestaUsuario = signal<string>('');
  modalAbierto = signal<boolean>(false); // 🔹 Nuevo: Controla si el modal está visible

  // ✅ Computed: Determina si el juego ha terminado y quién ganó
  juegoTerminado = computed(() => {
    return this.salaService.estado() === 'VICTORIA_P1' || this.salaService.estado() === 'VICTORIA_P2';
  });

  ganador = computed(() => {
    return this.salaService.estado() === 'VICTORIA_P1' 
      ? this.salaService.jugador1().name 
      : this.salaService.jugador2().name;
  });

  constructor() { 
    effect(() => {
      if (this.juegoTerminado()) {
        setTimeout(() => this.modalAbierto.set(true), 0); // ✅ Sin necesidad de `allowSignalWrites`
        if(this.ganador() === this.salaService.name()){
          console.log('Éste es el ganador.')
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
