import { Component, inject, OnInit, signal } from '@angular/core';
import { RankingUseCaseService } from '../../../application/ranking-use-case.service';
import { RankingMemory } from '../../../domain/ranking.model';
import { LocalKeys, LocalManagerService } from '../../../../shared/LocalManager/storage.servicee';

@Component({
  selector: 'app-table-memory',
  standalone: true,
  imports: [],
  templateUrl: './table-memory.component.html',
  styleUrl: './table-memory.component.css'
})
export class TableMemoryComponent implements OnInit {
  private _rankingUseCase = inject(RankingUseCaseService);

  ranking = signal<RankingMemory[]>([]);

  ngOnInit(): void {
    const token = LocalManagerService.getElement(LocalKeys.token);
    if (token) {
      this._rankingUseCase.getRankingMemory().subscribe((data) => {
        this.ranking.set(data);
      });
    }
  }
}
