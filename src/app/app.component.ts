import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContextDropdownModule } from './context-dropdown/context-dropdown.module';
import { Option } from './context-dropdown/model/option';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ContextDropdownModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'context-dropdown';
  imagePath = 'assets/placeholder.webp';

  // reference to the MatMenuTrigger in the DOM
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger;
  menuTopLeftPosition = { x: 0, y: 0 };

  get options() {
    return [
      {
        id: 1,
        name: 'Pizza',
      },
      {
        id: 2,
        name: 'Spaghetti',
      },
      {
        id: 3,
        name: 'Macaroni',
      },
    ];
  }

  /**
   * Method called when the user click with the right button
   * @param event MouseEvent, it contains the coordinates
   * @param item Our data contained in the row of the table
   */
  onRightClick(event: MouseEvent): void {
    // prevents the normal context menu
    event.preventDefault();

    // we record the mouse position in our object
    // mat-menu seems to automatically reposition if it is out of bounds
    this.menuTopLeftPosition.x = event.clientX;
    this.menuTopLeftPosition.y = event.clientY;

    // we pass to the menu the predefined options in the get method
    this.matMenuTrigger.menuData = { menuOptions: this.options };

    this.matMenuTrigger.openMenu();
  }

  setSelectedOption(selectedOption: Option) {
    this.imagePath = `assets/${selectedOption.name.toLowerCase()}.webp`;
  }

  getFormattedFileName(imagePath: string): string {
    const fileName = imagePath.split('/').pop()?.split('.')[0] || '';
    return fileName.charAt(0).toUpperCase() + fileName.slice(1);
  }
}
