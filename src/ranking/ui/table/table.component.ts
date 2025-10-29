import { Component, inject, OnInit, signal } from '@angular/core';
import { RankingUseCaseService } from '../../application/ranking-use-case.service';
import { DecodeJwtService } from '../../../shared/LocalManager/decode.jwt';
import { LocalKeys, LocalManagerService } from '../../../shared/LocalManager/storage.servicee';
import { RankingGuess } from '../../domain/ranking.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  private _rankingUseCase = inject(RankingUseCaseService);

  ranking = signal<RankingGuess[] | null>([]);

  ngOnInit(): void {
    const token = LocalManagerService.getElement(LocalKeys.token);
    if(token){
      this._rankingUseCase.getRankingGuess().subscribe((data) =>{
        console.log('Data: ',data);
        this.ranking.set(data);
      })
    }
  }
}
