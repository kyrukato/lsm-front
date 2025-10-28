import { Component } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { TableMemoryComponent } from '../table/table-memory/table-memory.component';
import { TableSequenceComponent } from '../table/table-sequence/table-sequence.component';

@Component({
  selector: 'app-rankings',
  standalone: true,
  imports: [TableComponent, TableMemoryComponent, TableSequenceComponent],
  templateUrl: './rankings.component.html',
  styleUrl: './rankings.component.css'
})
export class RankingsComponent {

}
