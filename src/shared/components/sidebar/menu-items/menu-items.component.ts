import { Component } from '@angular/core';
import {
  LucideAngularModule,
  BookOpen,
  Gamepad2,
  Puzzle,
  List,
  WholeWord,
  Swords,
  Sword,
  Trophy,
} from 'lucide-angular';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.css'],
  imports: [LucideAngularModule],
  standalone: true,
})
export class MenuItemsComponent {
  readonly BookOpenIcon = BookOpen;
  readonly Gamepad2Icon = Gamepad2;
  readonly PuzzleIcon = Puzzle;
  readonly ListIcon = List;
  readonly OnlineIcon = Swords;
  readonly LocalIcon = Sword;
  readonly Ranking = Trophy;
}
