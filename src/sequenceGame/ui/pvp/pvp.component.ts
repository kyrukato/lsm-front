import { Component, computed, effect, inject, signal } from '@angular/core';
import { SalaService } from '../../services/sala.service';
import { ServerService } from '../../services/server.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DecodeJwtService } from '../../../shared/LocalManager/decode.jwt';
import { AuthUserUseCaseService } from '../../../auth/application/user/auth-user-use-case.service';
import { SequenceUseCaseService } from '../../application/sequence-use-case.service';
import { SequencePVP } from '../../infrastructure/models/sequence-local-api.modal';
import { response } from 'express';

@Component({
  selector: 'app-pvp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pvp.component.html',
  styleUrl: './pvp.component.css'
})
export class PvpComponent {
  serverService = inject(ServerService);
  salaService = inject(SalaService);
  decodeJWTService = inject(DecodeJwtService);
  authService = inject(AuthUserUseCaseService);
  sequenceService = inject(SequenceUseCaseService);
  userInput = signal<string>('');
  showModal = signal<boolean>(false);
  showSequence = signal<boolean>(false);
  currentSequenceIndex = signal<number>(0);
  sequenceStarted = signal<boolean>(false);
  player1 = signal<string>('');
  player2 = signal<string>('');

  juegoTerminado = computed(() => {
    return this.salaService.estado() === 'VICTORIA_P1' || 
           this.salaService.estado() === 'VICTORIA_P2' || 
           this.salaService.estado() === 'ABANDONADO';
  });

  ganador = computed(() => {
    if (this.salaService.estado() === 'VICTORIA_P1') {
      return this.player1();
    } else if (this.salaService.estado() === 'VICTORIA_P2') {
      return this.player2();
    } else {
      return 'EMPATE';
    }
  });

  bothPlayersPresent = computed(() => {
    return this.salaService.jugador1().name && this.salaService.jugador2().name;
  });

  constructor() {
    effect(() => {
      const p1 = this.salaService.jugador1().name;
      if(p1){
        this.authService.getUserData(p1).subscribe((data) => {
          this.player1.set(data.nickname);
        });
      }
    });
    
    effect(() => {
      const p2 = this.salaService.jugador2().name;
      if(p2){
        this.authService.getUserData(p2).subscribe((data) => {
          this.player2.set(data.nickname);
        });
      }
    });

    effect(() => {
      if (this.juegoTerminado()) {
        setTimeout(() => this.showModal.set(true), 0);
        if(this.ganador() === this.player1()){
          const token = this.salaService.jugador1().name;
          const userID = this.decodeJWTService.decodeId(token);
          const data:SequencePVP = {
            userID: userID,
          }
          this.sequenceService.updateVictorys(data).subscribe((response) => {
            console.log(response);
          });
        } else if(this.ganador() === this.player2()){
          const token = this.salaService.jugador2().name;
          const userID = this.decodeJWTService.decodeId(token);
          const data:SequencePVP = {
            userID: userID,
          }
          this.sequenceService.updateVictorys(data).subscribe((response) => {
            console.log(response);
          });
        }
      }
    });

    // Monitor for both players and start sequence
    effect(() => {
      if (this.bothPlayersPresent() && !this.sequenceStarted()) {
        this.sequenceStarted.set(true);
        setTimeout(() => {
          this.startSequenceDisplay();
        }, 2500); // Pequeño delay para asegurar sincronización
      } 
    }, { allowSignalWrites: true });

    // Reset sequence state when players change
    effect(() => {
      if (!this.bothPlayersPresent()) {
        this.sequenceStarted.set(false);
        this.showSequence.set(false);
        this.currentSequenceIndex.set(0);
      }
    });
  }

  startSequenceDisplay() {
    this.showSequence.set(true);
    this.currentSequenceIndex.set(0);
    const sequenceLength = this.salaService.imageURL().length;
    let currentIndex = 0;

    const showNextImage = () => {
      if (currentIndex < sequenceLength) {
        this.currentSequenceIndex.set(currentIndex);
        currentIndex++;
        setTimeout(showNextImage, 1000);
      } else {
        this.showSequence.set(false);
      }
    };

    showNextImage();
  }

  async findRoom() {
    // Reset sequence state before finding new room
    this.sequenceStarted.set(false);
    this.showSequence.set(false);
    this.currentSequenceIndex.set(0);

    this.serverService.server.emitWithAck('encontrarSala').then(res => {
      if (res === null) {
        this.salaService.crearSala();
      } else {
        this.salaService.unirseASala(res);
      }
    });
  }

  enviarRespuesta() {
    this.salaService.recibirRespuesta(this.userInput().toLocaleUpperCase());
    this.userInput.set('');
  }

  cerrarModal() {
    this.showModal.set(false);
    this.findRoom();
  }
}