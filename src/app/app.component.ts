import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContextDropdownModule } from './context-dropdown/context-dropdown.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ContextDropdownModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'context-dropdown';


  get options() {
    return [
      {
        id: 1,
        name: 'Pizza'
      },
      {
        id: 2,
        name: 'Spagetti'
      },
      {
        id: 3,
        name: 'Macaroni'
      },
    ]
  }
}
