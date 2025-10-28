import { Component, inject, OnInit, signal } from '@angular/core';
import { RankingUseCaseService } from '../../../application/ranking-use-case.service';
import { RankingSequence } from '../../../domain/ranking.model';
import { LocalKeys, LocalManagerService } from '../../../../shared/LocalManager/storage.servicee';

@Component({
  selector: 'app-table-sequence',
  standalone: true,
  imports: [],
  templateUrl: './table-sequence.component.html',
  styleUrl: './table-sequence.component.css'
})
export class TableSequenceComponent implements OnInit {
  private _rankingUseCase = inject(RankingUseCaseService);

  ranking = signal<RankingSequence[] | null>([]);

  ngOnInit(): void {
    const token = LocalManagerService.getElement(LocalKeys.token);
    if (token) {
      this._rankingUseCase.getRankingSequence().subscribe((data) => {
        this.ranking.set(data);
      });
    }
  }
}
